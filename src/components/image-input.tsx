"use client";

import { faker } from "@faker-js/faker";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ChangeEvent } from "react";
import type { ControllerRenderProps, Path } from "react-hook-form";
import type { z } from "zod";

import { FormControl, FormLabel } from "@/components/ui/form";

export function ImageInput<T extends z.infer<z.ZodObject<z.ZodRawShape>>>({
  field,
  label,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  label: string;
}) {
  // TODO: parse the image from the field value (UUID) on initial data population
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file == null) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      // `reader.result` is Base64 data string containing the image
      // the backend expects a UUID key which probably corresponds to an uploaded resource
      // TODO: handle uploading the image to the server
      field.onChange(faker.string.uuid());
      if (typeof reader.result === "string") {
        setCurrentImage(reader.result);
      } else {
        console.error("Failed to read image file:", reader.result);
      }
    });
    reader.readAsDataURL(file);
  }

  return (
    <FormLabel className="flex flex-col items-start space-y-1.5">
      {label}
      <FormControl>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            handleImageChange(event);
          }}
          className="hidden"
        />
      </FormControl>
      <div className="bg-background border-input flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border md:h-48 md:w-48">
        {field.value === "" || currentImage == null ? (
          <>
            <Camera className="text-image-input-icon h-12 w-12" />
            <span className="text-muted-foreground text-xs">
              Kliknij, aby dodać zdjęcie
            </span>
          </>
        ) : (
          <Image
            src={currentImage}
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
