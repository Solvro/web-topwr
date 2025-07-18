"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { TypeOf, ZodType, z } from "zod";

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
import type { AbstractResourceFormInputs } from "@/types/forms";

export function AbstractResourceForm<T extends ZodType>({
  schema,
  defaultValues,
  createOnSubmit,
  editOnSubmit,
  formInputs: {
    imageInputs = [],
    textInputs = [],
    richTextInput,
    selectInputs = [],
    checkboxInputs = [],
  },
  returnButtonPath,
  returnButtonLabel,
}: {
  schema: T;
  defaultValues?: TypeOf<T> & { id?: number };
  createOnSubmit: (data: TypeOf<T>) => void;
  editOnSubmit: (id: number, data: TypeOf<T>) => void;
  formInputs: AbstractResourceFormInputs<z.infer<T>>;
  returnButtonPath: string;
  returnButtonLabel: string;
}) {
  const form = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(values: TypeOf<T>) {
    if (defaultValues == null || defaultValues.id === undefined) {
      createOnSubmit(values);
    } else {
      editOnSubmit(defaultValues.id as number, values);
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
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background placeholder:text-foreground shadow-none"
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
                    name={richTextInput.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{richTextInput.label}</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background placeholder:text-foreground h-20 shadow-none"
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
                      name={input.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{input.label}</FormLabel>
                          <Select
                            value={String(field.value ?? "")}
                            onValueChange={(value) => {
                              field.onChange(
                                Number.isNaN(Number(value))
                                  ? value
                                  : Number(value),
                              );
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background w-full shadow-none">
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
                    name={input.name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row space-x-2">
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
              <Link href={returnButtonPath} className="">
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
