import type { ComponentProps } from "react";

import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";

export function RichTextInput({
  disabled = false,
  ...props
}: ComponentProps<typeof MinimalTiptapEditor> & { disabled?: boolean }) {
  return (
    <MinimalTiptapEditor
      editorContentClassName="p-4"
      placeholder="Wpisz opis..."
      editable={!disabled}
      output="html"
      {...props}
    />
  );
}
