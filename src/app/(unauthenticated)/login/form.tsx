"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TOAST_MESSAGES } from "@/config/constants";
import { useAuth } from "@/hooks/use-auth";
import { LoginSchema } from "@/schemas";
import type { LoginFormValues } from "@/types/forms";

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: auth.login,
    onSuccess: () => {
      router.push("/");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          toast.promise(mutateAsync(data), TOAST_MESSAGES.login),
        )}
        className="bg-background w-full space-y-4 rounded-xl px-6 py-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="border-primary"
                  placeholder="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  className="border-primary bg-none"
                  type="password"
                  placeholder="hasło"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                  className="mb-0"
                />
              </FormControl>
              <FormLabel>Zapamiętaj mnie</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" loading={isPending} disabled={isSuccess}>
            Zaloguj się
          </Button>
        </div>
      </form>
    </Form>
  );
}
