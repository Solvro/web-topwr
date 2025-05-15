"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import SolvroLogo from "@/../public/logo-solvro.png";
import TOPWRLogo from "@/../public/logo-topwr-white.png";
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
import { LoginSchema } from "@/schemas";

export default function Page() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    // eslint-disable-next-line no-console
    console.log(values);
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-[#F47147] to-[#DF381C]">
      <div className="-mt-20 flex w-96 flex-col items-center space-y-4">
        <Image src={TOPWRLogo} alt={""} className="p-8" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-background w-full space-y-4 rounded-xl px-6 py-6"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary bg-none"
                      type="password"
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" className="">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <a
        href="https://solvro.pwr.edu.pl"
        className="absolute bottom-4 aspect-square w-12"
        target="_blank"
        rel="noreferrer"
      >
        <Image src={SolvroLogo} alt={""} className="h-full w-full"></Image>
      </a>
    </div>
  );
}
