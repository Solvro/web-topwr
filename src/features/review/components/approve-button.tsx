"use client";

import { Check } from "lucide-react";
import type { Route } from "next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchMutation, useMutationWrapper } from "@/features/backend";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import type { ResourcePk } from "@/features/resources/types";
import { useRouter } from "@/hooks/use-router";
import { sanitizeId } from "@/utils";

export function ApproveButton({
  id,
  resource,
}: {
  id: ResourcePk;
  resource: Resource;
  showLabel?: boolean;
}) {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutationWrapper<unknown, null>(
    `approve-draft__${resource}__${String(id)}`,
    async () => {
      const result = await fetchMutation(`${sanitizeId(id)}/approve`, {
        method: "POST",
        resource,
        draft: true,
      });
      router.push(`/${resource}` as Route);
      router.refresh();
      return result;
    },
  );

  const declensions = declineNoun(resource);

  //TODO: dialog?
  return (
    <Button
      variant="outline"
      loading={isPending}
      tooltip={`Zatwierdź draft ${declensions.genitive}`}
      onClick={() => {
        toast.promise(mutateAsync(null), {
          loading: "Zatwierdzanie...",
          success: "Zatwierdzono",
          error: "Błąd zatwierdzania",
        });
      }}
    >
      Zatwierdź
      <Check />
    </Button>
  );
}
