"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordInput } from "@/components/inputs/password-input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FetchError } from "@/features/backend";
import { logger, parseError } from "@/features/logging";
import { getToastMessages } from "@/lib/get-toast-messages";

import { changePassword } from "../api/change-password";
import { ChangePasswordSchema } from "../schemas/change-password-schema";
import type { ChangePasswordFormValues } from "../schemas/change-password-schema";

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: changePassword,
  });

  function handleServerValidationErrors(error: unknown) {
    if (!(error instanceof FetchError)) {
      return false;
    }
    const validationIssues = error.errorReport?.error.validationIssues;
    if (!Array.isArray(validationIssues)) {
      return false;
    }
    for (const issue of validationIssues) {
      const fieldName =
        (issue as Record<string, unknown>).field ??
        (issue as Record<string, unknown>).rule;
      const message = (issue as Record<string, unknown>).message;
      if (fieldName === "oldPassword") {
        const serverMessage = typeof message === "string" ? message : undefined;
        let toastMessage: string | undefined;
        try {
          toastMessage = (
            getToastMessages.changePassword as { invalidOldPassword?: string }
          ).invalidOldPassword;
        } catch (error_) {
          logger.error(
            parseError(error_),
            "ChangePasswordForm: failed to get invalidOldPassword message",
          );
        }

        const fieldMessage =
          typeof toastMessage === "string" && toastMessage.length > 0
            ? toastMessage
            : serverMessage;

        form.setError("oldPassword", {
          type: "server",
          message: fieldMessage,
        });

        if (typeof toastMessage === "string" && toastMessage.length > 0) {
          toast.error(toastMessage);
        }

        return true;
      }
    }
    return false;
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(async (data) => {
          const messages = getToastMessages.changePassword;
          const loadingToast = toast.loading(messages.loading);
          try {
            await mutateAsync(data);
            toast.success(messages.success);
            form.reset();
          } catch (error: unknown) {
            const handled = handleServerValidationErrors(error);
            if (!handled) {
              const errorMessage =
                typeof messages.error === "function"
                  ? messages.error(error)
                  : (messages.error as string);
              toast.error(errorMessage);
            }
          } finally {
            toast.dismiss(loadingToast);
          }
        })}
        className="bg-background w-full max-w-md space-y-4 rounded-xl px-6 py-8"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <PasswordInput
              label="Aktualne hasło"
              placeholder="Aktualne hasło"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <PasswordInput
              label="Nowe hasło"
              placeholder="Nowe hasło"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <PasswordInput
              label="Powtórzone hasło"
              placeholder="Powtórzone hasło"
              {...field}
            />
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" loading={isPending}>
            Zmień hasło
          </Button>
        </div>
      </form>
    </Form>
  );
}
