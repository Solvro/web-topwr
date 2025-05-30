"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { FormLabel } from "@/components/ui/form";

export function ImageInput({ label }: { label: string }) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file == null) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setCurrentImage(reader.result as string);
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            handleImageChange(event);
          }}
          className="hidden"
        />
        <div className="bg-background flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg shadow-sm">
          {currentImage == null ? (
            <Camera className="h-12 w-12" color="#DDDDDD" />
          ) : (
            <Image
              src={currentImage}
              alt=""
              className="h-full max-w-full object-cover"
              width={256}
              height={256}
            />
          )}
        </div>
      </label>
    </div>
  );
}
