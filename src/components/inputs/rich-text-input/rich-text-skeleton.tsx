import type { Content } from "@tiptap/react";

import { cn } from "@/lib/utils";

import { MockToolbar } from "./mock-toolbar";

/**
 * Skeleton component for RichTextInput that renders while the TipTap editor is loading.
 * If value is provided as HTML, it renders the content as read-only to prevent layout shift.
 * Otherwise, it renders a simple skeleton placeholder.
 */
export function RichTextSkeleton({
  value,
  editable = true,
  editorContentClassName,
}: {
  value?: Content;
  editable?: boolean;
  editorContentClassName?: string;
}) {
  const hasHtmlContent = typeof value === "string" && value.trim().length > 0;

  return (
    <>
      {editable ? <MockToolbar /> : null}
      <div className={cn("minimal-tiptap-editor", editorContentClassName)}>
        {hasHtmlContent ? (
          <div
            className="ProseMirror opacity-60"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <p className="ProseMirror opacity-20">Wpisz opis...</p>
        )}
      </div>
    </>
  );
}
