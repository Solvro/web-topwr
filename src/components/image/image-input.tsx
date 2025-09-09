"use client";

import { Camera } from "lucide-react";
import type { ReactNode } from "react";
import type { Path } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Spinner } from "@/components/spinner";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TOAST_MESSAGES } from "@/config/constants";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { declineNoun } from "@/lib/polish";
import type { AppZodObject } from "@/types/app";

import { ApiImage } from "./api/client";

export function ImageInput<T extends z.infer<AppZodObject>>({
  name,
  onChange,
  label,
  existingImage,
}: {
  label: string;
  name: Path<T>;
  existingImage?: ReactNode;
  onChange: (value: string) => void;
}) {
  const { mutateAsync, isSuccess, isPending, data } = useMutationWrapper(
    `create__files__image__${name}`,
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetchMutation<{ key: string }>("files", {
        method: "POST",
        body: formData,
      });
      const [uuid, _fileExtension] = response.key.split(".");
      onChange(uuid);
      return response;
    },
  );

  const declensions = declineNoun("zdjęcie");

  return (
    <FormLabel className="flex flex-col items-start space-y-1.5">
      {label}
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file == null) {
              return;
            }
            toast.promise(
              mutateAsync(file),
              TOAST_MESSAGES.object(declensions).upload,
            );
          }}
          className="hidden"
        />
      </FormControl>
      <div className="bg-background border-input flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border md:h-48 md:w-48">
        {isPending ? (
          <Spinner />
        ) : isSuccess ? (
          <ApiImage imageKey={data.key} alt={label} />
        ) : (
          (existingImage ?? (
            <>
              <Camera className="text-image-input-icon h-12 w-12" />
              <span className="text-muted-foreground text-xs">
                Kliknij, aby dodać {declensions.nominative}
              </span>
            </>
          ))
        )}
      </div>
    </FormLabel>
  );
}
