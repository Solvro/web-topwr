"use client";

import { Camera, ImageUp, Trash } from "lucide-react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { z } from "zod";

import { Spinner } from "@/components/core/spinner";
import { InputSlot } from "@/components/inputs/input-slot";
import { Button } from "@/components/ui/button";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageType } from "@/config/enums";
import { ApiImage, uploadFile, useMutationWrapper } from "@/features/backend";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import type {
  ResourceFormValues,
  ResourceSchemaKey,
} from "@/features/resources/types";
import { getToastMessages } from "@/lib/get-toast-messages";
import type { WrapperProps } from "@/types/components";

import { ImagePreviewModal } from "../presentation/image-preview-modal";

function InputBox({ children }: WrapperProps) {
  return (
    <InputSlot
      renderAs="div"
      className="aspect-video h-fit max-h-48 w-full overflow-hidden rounded-lg md:size-48"
    >
      {children}
    </InputSlot>
  );
}

export function ImageUpload<T extends Resource>({
  name,
  onChange,
  value,
  label,
  type = ImageType.Logo,
  existingImage,
  resourceData,
}: {
  name: ResourceSchemaKey<T, z.ZodString>;
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  type?: ImageType;
  existingImage?: ReactNode;
  resourceData?: ResourceFormValues<T>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { mutateAsync, isSuccess, isPending, data, reset } = useMutationWrapper(
    `create__files__image__${name}`,
    async (metadata: { file: File }) => {
      const { uuid, response } = await uploadFile(metadata);
      onChange(uuid);
      return response;
    },
  );

  const declensions = declineNoun("image");
  const spinner = isPending ? <Spinner /> : null;

  const uploadedImage = isSuccess ? (
    <ApiImage
      imageKey={data.key}
      alt={label}
      resourceData={resourceData}
      type={type}
    />
  ) : (
    spinner
  );
  const serverImage = value == null ? null : existingImage;
  const image = uploadedImage ?? serverImage;
  const hasImage = image != null;
  const imageKey = data?.key ?? value;

  function openUploadDialog() {
    inputRef.current?.click();
  }

  const input = (
    <Input
      ref={inputRef}
      type="file"
      accept="image/*"
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file == null) {
          return;
        }
        toast.promise(
          mutateAsync({ file }),
          getToastMessages.object(declensions).upload,
        );
      }}
      className="hidden"
    />
  );

  return (
    <>
      <FormLabel className="flex flex-col items-start space-y-1.5">
        {label}
        {hasImage ? null : (
          <InputBox>
            <div className="flex size-full cursor-pointer flex-col items-center justify-center">
              <Camera className="text-image-input-icon size-12" />
              <span className="text-muted-foreground text-xs">
                Kliknij, aby dodać {declensions.nominative}
              </span>
            </div>
          </InputBox>
        )}
      </FormLabel>
      {hasImage ? (
        <InputBox>
          <FormControl>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-full cursor-zoom-in"
              onClick={() => {
                setIsPreviewOpen(true);
              }}
            >
              {image}
            </Button>
          </FormControl>
          {input}
        </InputBox>
      ) : (
        <FormControl>{input}</FormControl>
      )}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        setIsOpen={setIsPreviewOpen}
        image={
          imageKey == null
            ? null
            : (spinner ?? (
                <ApiImage
                  imageKey={imageKey}
                  alt={label}
                  resourceData={resourceData}
                  type={type}
                  width={1500}
                  style={{ background: "none" }}
                  className="max-h-[80svh] object-scale-down"
                />
              ))
        }
        footer={
          <>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onChange(null);
                reset();
                setIsPreviewOpen(false);
              }}
            >
              Usuń zdjęcie <Trash />
            </Button>
            <Button
              type="button"
              onClick={() => {
                openUploadDialog();
              }}
            >
              Zmień zdjęcie <ImageUp />
            </Button>
          </>
        }
      />
    </>
  );
}
