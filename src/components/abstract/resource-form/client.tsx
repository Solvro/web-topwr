"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { DefaultValues, Resolver } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { ColorInput } from "@/components/inputs/color-input";
import { DatePicker } from "@/components/inputs/date-picker";
import { DateTimePicker } from "@/components/inputs/date-time-picker";
import { ImageUpload } from "@/components/inputs/image-upload";
import { OptionalInputRow } from "@/components/inputs/input-row";
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import { RESOURCE_SCHEMAS } from "@/schemas";
import type { ModifyResourceResponse } from "@/types/api";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";
import type { AbstractResourceFormInputs } from "@/types/forms";

import type { ExistingImages } from ".";

type WithOptionalId<T> = T & { id?: number };
type SchemaWithOptionalId<T extends z.ZodType> = WithOptionalId<z.infer<T>>;

const isExistingResourceItem = <T extends z.ZodType>(
  defaultValues?: SchemaWithOptionalId<T>,
): defaultValues is z.infer<T> & { id: number } =>
  defaultValues != null &&
  "id" in defaultValues &&
  defaultValues.id !== undefined &&
  typeof defaultValues.id === "number";

const getMutationConfig = <T extends z.ZodType>(
  resource: Resource,
  defaultValues?: SchemaWithOptionalId<T>,
) =>
  isExistingResourceItem(defaultValues)
    ? ({
        mutationKey: `update__${resource}__${String(defaultValues.id)}`,
        endpoint: sanitizeId(String(defaultValues.id)),
        method: "PATCH",
      } as const)
    : ({
        mutationKey: `create__${resource}`,
        endpoint: "/",
        method: "POST",
      } as const);

export function AbstractResourceFormInternal<T extends Resource>({
  resource,
  defaultValues,
  existingImages,
}: {
  resource: T;
  defaultValues: DefaultValues<ResourceDataType<T> | ResourceFormValues<T>>;
  existingImages: ExistingImages<T>;
}) {
  const schema = RESOURCE_SCHEMAS[resource];
  const router = useRouter();
  const form = useForm<ResourceFormValues<T>>({
    // Maybe try extracting the id from the defaultValues and passing it as an editedResourceId prop?
    // @ts-expect-error TODO: the schema is compatible but for some reason the types don't match
    resolver: zodResolver(schema) as Resolver<ResourceFormValues<T>>,
    defaultValues: defaultValues as DefaultValues<ResourceFormValues<T>>,
  });

  const { mutationKey, endpoint, method } = getMutationConfig(
    resource,
    defaultValues,
  );

  const { mutateAsync, isPending } = useMutationWrapper<
    ModifyResourceResponse<T>,
    ResourceFormValues<T>
  >(mutationKey, async (body) => {
    const response = await fetchMutation<ModifyResourceResponse<T>>(endpoint, {
      body,
      method,
      resource,
    });
    router.refresh();
    form.reset(response.data);
    return response;
  });

  const declensions = declineNoun(resource);

  const metadata = RESOURCE_METADATA[resource];
  const {
    imageInputs = [],
    textInputs = [],
    textareaInputs = [],
    richTextInputs = [],
    dateInputs = [],
    datetimeInputs = [],
    colorInputs = [],
    selectInputs = [],
    checkboxInputs = [],
  } = metadata.form.inputs as AbstractResourceFormInputs<T>;

  return (
    <div className="mx-auto flex h-full flex-col">
      <Form {...form}>
        <form
          className="flex grow flex-col gap-4"
          onSubmit={form.handleSubmit((values) =>
            toast.promise(
              mutateAsync(values),
              TOAST_MESSAGES.object(declensions).modify,
            ),
          )}
        >
          <div className="grow basis-0 overflow-y-auto">
            <div className="bg-background-secondary flex min-h-full flex-col gap-4 rounded-xl p-4 md:flex-row">
              <div className="space-y-4">
                {imageInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <ImageUpload
                          {...field}
                          label={input.label}
                          existingImage={existingImages[field.name]}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="w-full space-y-4">
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
                            value={(field.value ?? "") as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {textareaInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-background placeholder:text-foreground shadow-none"
                            {...field}
                            value={(field.value ?? "") as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <OptionalInputRow
                  inputs={dateInputs}
                  mapper={(input) => (
                    <FormField
                      key={input.name}
                      control={form.control}
                      name={input.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{input.label}</FormLabel>
                          <DatePicker
                            {...field}
                            value={field.value as string | null}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
                {datetimeInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            value={field.value as string | null}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {richTextInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <MinimalTiptapEditor
                            // @ts-expect-error types not matching
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            className="w-full"
                            editorContentClassName="p-5"
                            output="html"
                            placeholder="Enter your description..."
                            editable
                            editorClassName="focus:outline-hidden"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <OptionalInputRow
                  inputs={colorInputs}
                  mapper={(input) => (
                    <FormField
                      key={input.name}
                      control={form.control}
                      name={input.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{input.label}</FormLabel>
                          <FormControl>
                            <ColorInput
                              {...field}
                              value={field.value as string | null}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
                <OptionalInputRow
                  className="grid grid-cols-1 lg:grid-cols-2"
                  inputs={selectInputs}
                  mapper={(input) => (
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
                                Number.isNaN(Number.parseInt(value))
                                  ? value
                                  : Number.parseInt(value),
                              );
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background w-full shadow-none">
                                <SelectValue placeholder={input.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-input">
                              {Object.values(input.optionEnum).map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                  {input.optionLabels[option]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
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
                            checked={(field.value ?? false) as boolean}
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
              <Link href={`/${resource}`} className="">
                <ChevronLeft />
                Wróć do{" "}
                {declineNoun(resource, {
                  case: DeclensionCase.Genitive,
                  plural: true,
                })}
              </Link>
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!form.formState.isDirty}
            >
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
