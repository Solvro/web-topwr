import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import type { Editor } from "@tiptap/react";
import type { Content, UseEditorOptions } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import {
  CodeBlockLowlight,
  Color,
  FileHandler,
  HorizontalRule,
  Image,
  Link,
  ResetMarksOnEnter,
  Selection,
  UnsetAllMarks,
} from "../extensions";
import { useThrottle } from "../hooks/use-throttle";
import { fileToBase64, getOutput, randomId } from "../utils";

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  output?: "html" | "json" | "text";
  placeholder?: string;
  editorClassName?: string;
  throttleDelay?: number;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
  uploader?: (file: File) => Promise<string>;
}

async function fakeuploader(file: File): Promise<string> {
  // NOTE: This is a fake upload function. Replace this with your own upload logic.
  // This function should return the uploaded image URL.

  // wait 3s to simulate upload
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const source = await fileToBase64(file);

  return source;
}

const createExtensions = ({
  placeholder,
  uploader,
}: {
  placeholder: string;
  uploader?: (file: File) => Promise<string>;
}) => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: "text-node" } },
    heading: { HTMLAttributes: { class: "heading-node" } },
    blockquote: { HTMLAttributes: { class: "block-node" } },
    bulletList: { HTMLAttributes: { class: "list-node" } },
    orderedList: { HTMLAttributes: { class: "list-node" } },
    code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
    dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
  }),
  Link,
  Underline,
  Image.configure({
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    allowBase64: true,
    uploadFn: async (file) => {
      //return uploader ? await uploader(file) : await fakeuploader(file);
      return typeof uploader === "function"
        ? await uploader(file)
        : await fakeuploader(file);
    },
    onToggle(editor, files, pos) {
      editor.commands.insertContentAt(
        pos,
        files.map((image) => {
          const blobUrl = URL.createObjectURL(image);
          const id = randomId();

          return {
            type: "image",
            attrs: {
              id,
              src: blobUrl,
              alt: image.name,
              title: image.name,
              fileName: image.name,
            },
          };
        }),
      );
    },
    onImageRemoved: (attributes) => {
      const { id, src } = attributes as { id: string; src: string };
      console.warn("Image removed", { id, src });
    },
    onValidationError(errors) {
      for (const error of errors) {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      }
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.success(mapping[action], {
        position: "bottom-right",
        description: "Image action success",
      });
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.error(`Failed to ${mapping[action]}`, {
        position: "bottom-right",
        description: error.message,
      });
    },
  }),
  FileHandler.configure({
    allowBase64: true,
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: async (editor, files, pos) => {
      for (const file of files) {
        const source = await fileToBase64(file);
        editor.commands.insertContentAt(pos, {
          type: "image",
          attrs: { src: source },
        });
      }
    },
    onPaste: async (editor, files) => {
      for (const file of files) {
        const source = await fileToBase64(file);
        editor.commands.insertContent({
          type: "image",
          attrs: { src: source },
        });
      }
    },
    onValidationError: (errors) => {
      for (const error of errors) {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      }
    },
  }),
  Color,
  TextStyle,
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder }),
];

export const useMinimalTiptapEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  uploader,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (content: Content) => onUpdate?.(content),
    throttleDelay,
  );

  const handleUpdate = React.useCallback(
    (editor: Editor) => {
      throttledSetValue(getOutput(editor, output));
    },
    [output, throttledSetValue],
  );

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value !== undefined && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value],
  );

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur],
  );

  const editor = useEditor({
    extensions: [
      BubbleMenuExtension,
      ...createExtensions({ placeholder, uploader }),
    ],
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", editorClassName),
      },
    },
    //should fix "Error: Tiptap Error: SSR has been detected"
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      handleUpdate(instance);
    },
    onCreate: ({ editor: instance }) => {
      handleCreate(instance);
    },
    onBlur: ({ editor: instance }) => {
      handleBlur(instance);
    },
    ...props,
  });

  return editor;
};

// export default useMinimalTiptapEditor;
