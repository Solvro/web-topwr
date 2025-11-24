"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/features/resources";
import type {
  ResourceFormValues,
  SubmitFormConfirmationMessage,
} from "@/features/resources/types";
import type { WrapperProps } from "@/types/components";
import type { OptionalPromise } from "@/types/helpers";

/** Confirmation modal shown before submitting the form, if configured. */
export function ArfConfirmationModal<T extends Resource>({
  confirmationMessage,
  onSubmit,
  form,
  ...props
}: WrapperProps & {
  confirmationMessage?: SubmitFormConfirmationMessage<T>;
  form: UseFormReturn<ResourceFormValues<T>>;
  onSubmit: () => OptionalPromise<void>;
  loading: boolean;
  disabled?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState(() => form.getValues());
  if (confirmationMessage == null) {
    return <Button type="submit" {...props} />;
  }
  const Description = confirmationMessage.description;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        type="button"
        onClick={async () => {
          const isValid = await form.trigger();
          if (!isValid) {
            return;
          }
          // only update the form value state if the dialog is being opened
          setItem(form.getValues());
          setIsModalOpen(true);
        }}
        {...props}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmationMessage.title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-2">
              <Description item={item} />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={async () => {
                await onSubmit();
              }}
              {...props}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
