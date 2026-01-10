"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
    mutationFn: async (data: ChangePasswordFormValues) =>
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        newPasswordConfirm: data.newPasswordConfirm,
      }),
    onSuccess: () => {
      toast.success("Hasło zmienione poprawnie");
      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((data) =>
          toast.promise(mutateAsync(data), {
            loading: "Trwa zmiana hasła...",
            success: "Hasło zmienione",
            error: (error) => (error instanceof Error ? error.message : "Błąd"),
          }),
        )}
        className="bg-background w-full max-w-md space-y-4 rounded-xl px-6 py-8"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aktualne hasło</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Aktualne hasło"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nowe hasło</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nowe hasło" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potwierdź nowe hasło</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Potwierdź nowe hasło"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
