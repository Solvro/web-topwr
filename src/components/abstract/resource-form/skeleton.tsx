"use client";

import type { ComponentProps } from "react";

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

export function AbstractResourceFormSkeleton() {
  return (
    <div className="bg-background-secondary mx-4 h-full gap-4 rounded-xl p-4">
      <div className="w-full space-y-4">
        {/* Text input */}
        <div>
          <LabelSkeleton />
          <InputSkeleton />
        </div>

        {/* Textarea */}
        <div>
          <LabelSkeleton />
          <InputSkeleton className="h-24" />
        </div>

        {/* Rich text editor */}
        <div>
          <LabelSkeleton />
          <InputSkeleton className="h-32" />
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
  );
}
