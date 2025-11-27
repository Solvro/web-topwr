import type { Content } from "@tiptap/react";
import sanitizeHtml from "sanitize-html";

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
  const sanitizedHtml = sanitizeHtml(value as string, {
    allowedAttributes: false,
  }).trim();

  return (
    <>
      {editable ? <MockToolbar /> : null}
      <div className={cn("minimal-tiptap-editor", editorContentClassName)}>
        {sanitizedHtml ? (
          <div
            className="ProseMirror opacity-60"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : (
          <p className="text-secondary">Wpisz opis...</p>
        )}
      </div>
    </>
  );
}
