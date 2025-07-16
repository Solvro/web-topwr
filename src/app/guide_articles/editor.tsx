"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { ImageInput } from "@/components/image-input";
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
import { GuideArticleSchema } from "@/schemas";
import type { GuideArticle } from "@/types/app";
import type { GuideArticleFormValues } from "@/types/schemas";

export function Editor({ initialData }: { initialData?: GuideArticle | null }) {
  const defaultValues: GuideArticleFormValues = initialData ?? {
    title: "",
    shortDesc: "",
    description: "",
  };

  const form = useForm<GuideArticleFormValues>({
    resolver: zodResolver(GuideArticleSchema),
    defaultValues,
  });

  // TODO: add images handling

  function createArticle(data: GuideArticleFormValues) {
    // TODO
    // eslint-disable-next-line no-console
    console.log("Creating article:", data);
  }

  function editArticle(id: number, data: GuideArticleFormValues) {
    // TODO
    // eslint-disable-next-line no-console
    console.log(`Updating article ${String(id)}:`, data);
  }

  function onSubmit(values: GuideArticleFormValues) {
    if (initialData == null) {
      createArticle(values);
    } else {
      editArticle(initialData.id, values);
    }
  }

  return (
    <div className="mx-auto flex h-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-grow flex-col space-y-4"
        >
          <div className="flex-[1_1_0] flex-grow overflow-y-auto">
            <div className="bg-background-secondary flex min-h-full flex-row space-y-4 space-x-4 rounded-xl p-4">
              <div className="flex w-48 flex-col space-y-4">
                <ImageInput label="Logo" />
              </div>

              <div className="flex w-full flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tytuł</FormLabel>
                      <FormControl>
                        <Input
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
                  name="shortDesc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Krótki opis</FormLabel>
                      <FormControl>
                        <Input
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
                          className="bg-background placeholder:text-foreground h-full min-h-32"
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
          </div>
          <div className="flex justify-end">
            <Button type="submit">Zapisz</Button>
          </div>
        </form>
      </Form>
      <Button
        variant="ghost"
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
