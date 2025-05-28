"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { ImageInput } from "@/app/components/image-input";
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
import type { GuideArticle } from "@/lib/types";
import { GuideArticleSchema } from "@/schemas";

export function Editor({ id }: { id: string | null }) {
  const form = useForm<z.infer<typeof GuideArticleSchema>>({
    resolver: zodResolver(GuideArticleSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          `https://api.topwr.solvro.pl/api/v1/guide_articles/${String(id)}`,
        );
        const { data } = (await response.json()) as {
          data: GuideArticle;
        };
        form.reset(data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };
    if (id !== null) {
      void fetchOrganizations();
    }
  }, [form, id]);

  function onSubmit(values: z.infer<typeof GuideArticleSchema>) {
    // eslint-disable-next-line no-console
    console.log(id ?? "no id");
    // eslint-disable-next-line no-console
    console.log(values);
  }

  return (
    <div className="mx-auto flex h-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-grow flex-col space-y-8"
        >
          <div className="bg-background-secondary flex flex-grow flex-row space-x-4 rounded-xl p-4">
            <div className="flex w-48 flex-col space-y-4">
              <ImageInput label="Logo" />
            </div>

            <div className="flex h-full w-full flex-col space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tytuł</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="bg-background placeholder:text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Krótki opis</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="bg-background placeholder:text-foreground"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="bg-background placeholder:text-foreground h-full"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Zapisz</Button>
          </div>
        </form>
      </Form>
      <Button
        variant={"ghost"}
        className="text-primary hover:text-primary w-min"
        asChild
      >
        <Link href="/guide_articles" className="">
          <ChevronLeft />
          Wroć do artykułów
        </Link>
      </Button>
    </div>
  );
}
