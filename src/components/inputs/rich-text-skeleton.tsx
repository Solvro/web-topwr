import type { Content } from "@tiptap/react";

import { InputSlot } from "@/components/inputs/input-slot";
import { MeasuredContainer } from "@/components/ui/minimal-tiptap/components/measured-container";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface RichTextSkeletonProps {
  value?: Content;
  editable?: boolean;
  className?: string;
  editorContentClassName?: string;
}

/**
 * Skeleton component for RichTextInput that renders while the TipTap editor is loading.
 * If value is provided as HTML, it renders the content as read-only to prevent layout shift.
 * Otherwise, it renders a simple skeleton placeholder.
 */
export function RichTextSkeleton({
  value,
  editable = true,
  className,
  editorContentClassName,
}: RichTextSkeletonProps) {
  const hasHtmlContent = typeof value === "string" && value.trim().length > 0;

  return (
    <InputSlot
      renderAs={MeasuredContainer}
      as="div"
      name="editor"
      className={cn(
        "border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs",
        className,
      )}
    >
      {editable ? (
        <div className="border-border flex h-12 shrink-0 border-b">
          <Skeleton className="m-2 h-8 w-full rounded-md" />
        </div>
      ) : null}
      <div className={cn("minimal-tiptap-editor", editorContentClassName)}>
        {hasHtmlContent ? (
          <div
            className="ProseMirror opacity-60"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
      </div>
    </InputSlot>
  );
}
