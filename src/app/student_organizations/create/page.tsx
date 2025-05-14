"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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
import { StudentOrganizationSchema } from "@/schemas";

export default function Page() {
  const form = useForm<z.infer<typeof StudentOrganizationSchema>>({
    resolver: zodResolver(StudentOrganizationSchema),
  });

  function onSubmit(values: z.infer<typeof StudentOrganizationSchema>) {
    // eslint-disable-next-line no-console
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input
                  className="border-primary"
                  placeholder="nazwa"
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
  );
}
