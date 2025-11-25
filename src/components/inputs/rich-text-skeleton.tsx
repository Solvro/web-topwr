import {
  CaretDownIcon,
  FontBoldIcon,
  FontItalicIcon,
  LetterCaseCapitalizeIcon,
  Link2Icon,
  ListBulletIcon,
  PlusIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import type { Content } from "@tiptap/react";

import { InputSlot } from "@/components/inputs/input-slot";
import { MeasuredContainer } from "@/components/ui/minimal-tiptap/components/measured-container";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface RichTextSkeletonProps {
  value?: Content;
  editable?: boolean;
  className?: string;
  editorContentClassName?: string;
}

/**
 * Mock toolbar that visually matches the real TipTap toolbar structure.
 */
function MockToolbar() {
  return (
    <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
      <div className="flex w-max items-center gap-px">
        {/* Text styles dropdown */}
        <Toggle disabled className="gap-0">
          <LetterCaseCapitalizeIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </Toggle>

        <Separator orientation="vertical" className="mx-2" />

        {/* Bold, Italic, Underline buttons */}
        <Toggle disabled>
          <FontBoldIcon className="size-5" />
        </Toggle>
        <Toggle disabled>
          <FontItalicIcon className="size-5" />
        </Toggle>
        <Toggle disabled>
          <UnderlineIcon className="size-5" />
        </Toggle>
        {/* More formatting dropdown */}
        <Toggle disabled className="w-8 gap-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className="size-5"
          >
            <path
              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </Toggle>

        <Separator orientation="vertical" className="mx-2" />

        {/* Color picker */}
        <Toggle disabled className="gap-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M4 20h16" />
            <path d="m6 16 6-12 6 12" />
            <path d="M8 12h8" />
          </svg>
          <CaretDownIcon className="size-5" />
        </Toggle>

        <Separator orientation="vertical" className="mx-2" />

        {/* Lists dropdown */}
        <Toggle disabled className="w-12 gap-0">
          <ListBulletIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </Toggle>

        <Separator orientation="vertical" className="mx-2" />

        {/* Link + Insert elements */}
        <Toggle disabled>
          <Link2Icon className="size-5" />
        </Toggle>
        <Toggle disabled className="w-12 gap-0">
          <PlusIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </Toggle>
      </div>
    </div>
  );
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
      {editable ? <MockToolbar /> : null}
      <div className={cn("minimal-tiptap-editor", editorContentClassName)}>
        {hasHtmlContent ? (
          <div
            className="ProseMirror opacity-60"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
          </div>
        )}
      </div>
    </InputSlot>
  );
}
