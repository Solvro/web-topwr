"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function InputSkeleton({
  className,
  ...props
}: ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      className={cn("bg-background h-9 w-full", className)}
      {...props}
    />
  );
}

function LabelSkeleton({
  className,
  ...props
}: ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      className={cn("bg-background mb-1 h-4 w-40 rounded-md", className)}
      {...props}
    />
  );
}

export function AbstractResourceFormSkeleton({
  showDeleteButton = true,
}: {
  showDeleteButton?: boolean;
}) {
  return (
    <div className="mx-4 box-border flex h-full flex-col gap-4">
      <div className="bg-background-secondary flex-1 rounded-xl p-4">
        <div className="flex h-full flex-col gap-4">
          {/* Text input */}
          <div>
            <LabelSkeleton />
            <InputSkeleton />
          </div>

          {/* Textarea */}
          <div className="flex flex-1 flex-col">
            <LabelSkeleton />
            <InputSkeleton className="flex-1" />
          </div>

          {/* Rich text editor */}
          <div className="flex flex-1 flex-col">
            <LabelSkeleton />
            <InputSkeleton className="flex-1" />
          </div>

          {/* Selects grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <LabelSkeleton />
              <InputSkeleton />
            </div>
            <div>
              <LabelSkeleton />
              <InputSkeleton />
            </div>
          </div>

          {/* Checkbox row */}
          <div>
            <LabelSkeleton />
            <div className="flex items-center space-x-2">
              <InputSkeleton className="h-5 w-5 rounded-sm" />
              <InputSkeleton className="h-5 w-40" />
            </div>
          </div>

          {/* Relations multiselects */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <LabelSkeleton />
              <InputSkeleton />
            </div>
            <div>
              <LabelSkeleton />
              <InputSkeleton />
            </div>
          </div>
        </div>
      </div>
      <Button className="bg-primary/50 hover:bg-primary/50" asChild>
        <Skeleton />
      </Button>
      {showDeleteButton ? (
        <Button variant="secondary" className="hover:bg-secondary" asChild>
          <Skeleton />
        </Button>
      ) : null}
    </div>
  );
}
