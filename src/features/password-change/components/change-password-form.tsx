"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordInput } from "@/components/inputs/password-input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FetchError } from "@/features/backend";

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ChangePasswordFormValues) =>
      changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        newPasswordConfirm: data.newPasswordConfirm,
      }),
    onSuccess: () => {
      toast.success("Hasło zmienione poprawnie");
      form.reset();
    },
    onError: (error) => {
      if (error instanceof FetchError) {
        const validationIssues = error.errorReport?.error.validationIssues;
        if (Array.isArray(validationIssues)) {
          for (const issue of validationIssues) {
            const fieldName =
              (issue as Record<string, unknown>).field ??
              (issue as Record<string, unknown>).rule;
            const message = (issue as Record<string, unknown>).message;
            if (fieldName === "oldPassword" && typeof message === "string") {
              form.setError("oldPassword", {
                type: "server",
                message,
              });
              toast.error(message);
              return;
            }
          }
        }
        toast.error(error.getCodedMessage("Nie udało się zmienić hasła"));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Nie udało się zmienić hasła");
      }
    },
    retry: false,
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((data) => {
          mutate(data);
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
              label="Potwierdź nowe hasło"
              placeholder="Potwierdź nowe hasło"
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
