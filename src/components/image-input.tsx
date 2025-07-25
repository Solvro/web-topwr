"use client";

import { Camera, Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ControllerRenderProps, Path } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { FormControl, FormLabel } from "@/components/ui/form";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { useQueryWrapper } from "@/hooks/use-query-wrapper";
import { fetchMutation, fetchQuery } from "@/lib/fetch-utils";
import type { FileEntry } from "@/types/api";

export function ImageInput<T extends z.infer<z.ZodObject<z.ZodRawShape>>>({
  field,
  label,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  label: string;
}) {
  const [fileUrl, setFileUrl] = useState("");

  const metadataQuery = useQueryWrapper(
    `read__files__image__${field.name}`,
    async () => {
      if (
        field.value == null ||
        field.value === "" ||
        typeof field.value !== "string"
      ) {
        return null;
      }
      const response = await fetchQuery<FileEntry>(
        `/files/${field.value as string}`,
      );
      setFileUrl(response.url);
      return response;
    },
  );

  const uploadMutation = useMutationWrapper(
    `create__files__image__${field.name}`,
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetchMutation<{ key: string }>("files", {
        method: "POST",
        body: formData,
      });
      const [uuid, _fileExtension] = response.key.split(".");
      field.onChange(uuid);
      return response;
    },
  );

  useEffect(() => {
    void metadataQuery.refetch();
  }, [metadataQuery]);

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
        {field.value === "" || field.value == null ? (
          <>
            <Camera className="text-image-input-icon h-12 w-12" />
            <span className="text-muted-foreground text-xs">
              Kliknij, aby dodać zdjęcie
            </span>
          </>
        ) : fileUrl === "" ? (
          <Loader className="animate-spin" />
        ) : (
          <Image
            src={fileUrl}
            alt={label}
            className="h-full max-w-full object-cover"
            width={256}
            height={256}
          />
        )}
      </div>
    </FormLabel>
  );
}
