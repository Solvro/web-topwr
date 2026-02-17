"use client";

import { ArrowUp } from "lucide-react";
import { toast } from "sonner";
import type { ZodNumber } from "zod";

import { Button } from "@/components/ui/button";
import { fetchMutation, useMutationWrapper } from "@/features/backend";
import type { Resource } from "@/features/resources";
import type { ResourceSchemaKey } from "@/features/resources/types";
import { getToastMessages } from "@/lib/get-toast-messages";

export function BumpValueButton<R extends Resource>({
  resource,
  field,
  bumpPath,
  currentValue,
  onSuccess,
}: {
  resource: R;
  field: ResourceSchemaKey<R, ZodNumber>;
  bumpPath: string;
  currentValue: number;
  onSuccess: (newValue: number) => void;
}) {
  const { mutateAsync, isPending } = useMutationWrapper(
    `${resource}__bump__${field}`,
    async () => {
      return await fetchMutation(`bump/${bumpPath}`, {
        resource,
      });
    },
  );

  function handleBump() {
    toast.promise(
      mutateAsync(null).then(() => {
        onSuccess(currentValue + 1);
      }),
      getToastMessages.resource(resource).bump,
    );
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={(event) => {
        event.preventDefault();
        handleBump();
      }}
      disabled={isPending}
      tooltip="Podbij wartość"
    >
      <ArrowUp />
    </Button>
  );
}
