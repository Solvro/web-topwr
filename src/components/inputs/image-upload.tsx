"use client";

import { Camera } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { z } from "zod";

import { ApiImage } from "@/components/api-image/client";
import { InputSlot } from "@/components/inputs/input-slot";
import { Spinner } from "@/components/spinner";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TOAST_MESSAGES } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { ImageType } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { uploadFile } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { ResourceFormValues } from "@/types/app";
import type { ResourceSchemaKey } from "@/types/forms";

export function ImageUpload<T extends Resource>({
  name,
  onChange,
  label,
  type = ImageType.Logo,
  existingImage,
  resourceData,
}: {
  label: string;
  type?: ImageType;
  name: ResourceSchemaKey<T, z.ZodString>;
  existingImage?: ReactNode;
  onChange: (value: string) => void;
  resourceData?: ResourceFormValues<T>;
}) {
  const { mutateAsync, isSuccess, isPending, data } = useMutationWrapper(
    `create__files__image__${name}`,
    async (metadata: { file: File }) => {
      const { uuid, response } = await uploadFile(metadata);
      onChange(uuid);
      return response;
    },
  );

  const declensions = declineNoun("image");

  return (
    <>
      <FormLabel className="flex flex-col items-start space-y-1.5">
        {label}
        <InputSlot
          renderAs="div"
          className="aspect-video max-h-48 w-full cursor-pointer overflow-hidden rounded-lg md:size-48"
        >
          {isPending ? (
            <Spinner />
          ) : isSuccess ? (
            <ApiImage
              imageKey={data.key}
              alt={label}
              resourceData={resourceData}
              type={type}
            />
          ) : (
            (existingImage ?? (
              <div className="flex size-full flex-col items-center justify-center">
                <Camera className="text-image-input-icon size-12" />
                <span className="text-muted-foreground text-xs">
                  Kliknij, aby dodać {declensions.nominative}
                </span>
              </div>
            ))
          )}
        </InputSlot>
      </FormLabel>
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
              mutateAsync({ file }),
              TOAST_MESSAGES.object(declensions).upload,
            );
          }}
          className="hidden"
        />
      </FormControl>
    </>
  );
}
