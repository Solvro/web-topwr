"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
import type { GuideArticle, GuideArticleFormValues } from "@/lib/types";
import { GuideArticleSchema } from "@/schemas";

export function Editor({ initialData }: { initialData?: GuideArticle | null }) {
  const form = useForm<GuideArticleFormValues>({
    resolver: zodResolver(GuideArticleSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData != null) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  function onSubmit(values: GuideArticleFormValues) {
    // eslint-disable-next-line no-console
    console.log(values);
    if (initialData == null) {
      //TODO: create new
    } else {
      //TODO: update existing
      // eslint-disable-next-line no-console
      console.log(initialData.id);
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
                  name="shortDescription"
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
