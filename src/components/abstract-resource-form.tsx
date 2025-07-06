"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { TypeOf, ZodType } from "zod";

import { ImageInput } from "@/components/image-input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  formCheckboxInputs,
  formImageInputs,
  formRichTextInput,
  formSelectInputs,
  formTextInputs,
} from "@/lib/types";

export function AbstractEditor<T extends ZodType>({
  schema,
  defaultValues,
  createOnSubmit,
  editOnSubmit,
  imageInputs = [],
  textInputs = [],
  richTextInput,
  selectInputs = [],
  checkboxInputs = [],
  returnButtonLabel,
}: {
  schema: T;
  defaultValues?: TypeOf<T>;
  createOnSubmit: (data: TypeOf<T>) => void;
  editOnSubmit: (id: number, data: TypeOf<T>) => void;
  imageInputs?: formImageInputs[];
  textInputs?: formTextInputs[];
  richTextInput?: formRichTextInput;
  selectInputs?: formSelectInputs[];
  checkboxInputs?: formCheckboxInputs[];
  returnButtonLabel: string;
}) {
  const form = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(values: TypeOf<T>) {
    if (
      defaultValues != null &&
      (defaultValues as { id?: number }).id !== undefined
    ) {
      editOnSubmit((defaultValues as { id: number }).id, values);
    } else {
      createOnSubmit(values);
    }
  }

  return (
    <div className="mx-auto flex h-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex grow flex-col space-y-4"
        >
          <div className="grow basis-[0] overflow-y-auto">
            <div className="bg-background-secondary flex min-h-full flex-col space-y-4 space-x-4 rounded-xl p-4 md:flex-row">
              {/* // TODO: include images in form data */}
              <div className="flex w-full flex-col space-y-4 md:w-48">
                {imageInputs.map((input) => (
                  <ImageInput key={input.label} label={input.label} />
                ))}
              </div>

              <div className="flex w-full flex-col space-y-4">
                {textInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name as TypeOf<T>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background placeholder:text-foreground border-none shadow-none"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {/* // TODO: rich text editor */}
                {richTextInput != null && (
                  <FormField
                    key={richTextInput.name}
                    control={form.control}
                    name={richTextInput.name as TypeOf<T>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{richTextInput.label}</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background placeholder:text-foreground h-20 border-none shadow-none"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {selectInputs.map((input) => (
                    <FormField
                      key={input.name}
                      control={form.control}
                      name={input.name as TypeOf<T>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{input.label}</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              if (!value && input.allowNull === true) {
                                field.onChange(null);
                              }

                              if (typeof input.options[0]?.value === "number") {
                                field.onChange(value ? Number(value) : null);
                              } else {
                                field.onChange(value || null);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background w-full border-none shadow-none">
                                <SelectValue placeholder={input.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-input">
                              {input.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {checkboxInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name as TypeOf<T>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row">
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            className="bg-background"
                            onCheckedChange={(checked) => {
                              field.onChange(Boolean(checked));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary w-min"
              asChild
            >
              <Link href="/guide_articles" className="">
                <ChevronLeft />
                {returnButtonLabel}
              </Link>
            </Button>
            <Button type="submit">Zapisz</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
