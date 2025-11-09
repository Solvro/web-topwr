// @ts-nocheck
import type { Content, Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

import { InputSlot } from "@/components/inputs/input-slot";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { MeasuredContainer } from "./components/measured-container";
import { SectionFive } from "./components/section/five";
import { SectionFour } from "./components/section/four";
import { SectionOne } from "./components/section/one";
import { SectionThree } from "./components/section/three";
import { SectionTwo } from "./components/section/two";
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap";
import "./styles/index.css";

interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
      <div className="flex w-max items-center gap-px">
        <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5]} />

        <Separator orientation="vertical" className="mx-2" />

        <SectionTwo
          editor={editor}
          activeActions={[
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "code",
            "clearFormatting",
          ]}
          mainActionCount={3}
        />

        <Separator orientation="vertical" className="mx-2" />

        <SectionThree editor={editor} />

        <Separator orientation="vertical" className="mx-2" />

        <SectionFour
          editor={editor}
          activeActions={["orderedList", "bulletList"]}
          mainActionCount={0}
        />

        <Separator orientation="vertical" className="mx-2" />

        <SectionFive
          editor={editor}
          activeActions={["codeBlock", "blockquote", "horizontalRule"]}
          mainActionCount={0}
        />
      </div>
    </div>
  );
}

export function MinimalTiptapEditor({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: MinimalTiptapProps) {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <InputSlot
      renderAs={MeasuredContainer}
      as="div"
      name="editor"
      className={cn(
        "border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </InputSlot>
  );
}

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";
