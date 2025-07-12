"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import SolvroLogo from "@/../public/logo-solvro.png";
import LogoToPWR from "@/../public/logo-topwr-white.png";
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
import { SOLVRO_WEBPAGE_URL } from "@/config/constants";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/error-handling";
import { LoginSchema } from "@/schemas";
import type { LoginFormValues } from "@/types/schemas";

export default function LoginPage() {
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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: auth.login,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div className="from-gradient-1 to-gradient-2 flex h-full w-full items-center justify-center bg-gradient-to-r">
      <div className="-mt-20 flex w-96 flex-col items-center space-y-4 p-4">
        <Image src={LogoToPWR} alt={"Logo ToPWR"} className="p-10" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              toast.promise(mutateAsync(data), {
                loading: "Trwa logowanie...",
                success: (response) =>
                  `Pomyślnie zalogowano jako ${response.user.fullName ?? response.user.email}!`,
                error: (error) =>
                  getErrorMessage(error, "Nastąpił błąd podczas logowania"),
              }),
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
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                      className="my-auto"
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mx-auto mt-8 block h-10 w-24 transition duration-300 hover:opacity-90"
              loading={isPending}
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
      <Link
        href={SOLVRO_WEBPAGE_URL}
        className="absolute bottom-4 h-6 md:bottom-8"
        target="_blank"
        rel="noreferrer"
      >
        <Image src={SolvroLogo} alt={"Logo Solvro"} className="h-full w-full" />
      </Link>
    </div>
  );
}
