"use client";

import { Camera } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { FormControl, FormLabel } from "@/components/ui/form";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";

import type { ImageInputProps, ImageInputPropsGeneric } from ".";

export function ImageInputClient<T extends ImageInputPropsGeneric>({
  name,
  onChange,
  label,
  existingImage,
}: ImageInputProps<T> & { existingImage: ReactNode }) {
  const uploadMutation = useMutationWrapper(
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

  return (
    <FormLabel className="flex flex-col items-start space-y-1.5">
      {label}
      <FormControl>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file == null) {
              return;
            }
            toast.promise(uploadMutation.mutateAsync(file), {
              loading: "Trwa przesyłanie zdjęcia...",
              success: "Zdjęcie przesłano pomyślnie!",
              error: "Wystąpił błąd podczas przesyłania zdjęcia.",
            });
          }}
          className="hidden"
        />
      </FormControl>
      <div className="bg-background border-input flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border md:h-48 md:w-48">
        {existingImage ?? (
          <>
            <Camera className="text-image-input-icon h-12 w-12" />
            <span className="text-muted-foreground text-xs">
              Kliknij, aby dodać zdjęcie
            </span>
          </>
        )}
      </div>
    </FormLabel>
  );
}
