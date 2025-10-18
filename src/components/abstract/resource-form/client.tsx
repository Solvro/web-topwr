"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { get, useForm } from "react-hook-form";
import type { DefaultValues, Resolver } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { ColorInput } from "@/components/inputs/color-input";
import { DatePicker } from "@/components/inputs/date-picker";
import { DateTimePicker } from "@/components/inputs/date-time-picker";
import { ImageUpload } from "@/components/inputs/image-upload";
import { Inputs } from "@/components/inputs/input-row";
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
import { Label } from "@/components/ui/label";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { MultiSelect } from "@/components/ui/multi-select";
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
import { RELATED_RESOURCE_METADATA } from "@/config/resources";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { sanitizeId, toTitleCase } from "@/lib/helpers";
import { getResourceMetadata } from "@/lib/helpers/app";
import { declineNoun } from "@/lib/polish";
import { RESOURCE_SCHEMAS } from "@/schemas";
import type { ModifyResourceResponse } from "@/types/api";
import type {
  QueriedRelations,
  RelationConfiguration,
  ResourceDataType,
  ResourceFormValues,
  ResourceRelation,
  ResourceRelations,
} from "@/types/app";

import type { ExistingImages } from ".";

type WithOptionalId<T> = T & { id?: number };
type SchemaWithOptionalId<T extends z.ZodType> = WithOptionalId<z.infer<T>>;

const isExistingResourceItem = <T extends z.ZodType>(
  defaultValues?: SchemaWithOptionalId<T>,
): defaultValues is Omit<z.infer<T>, "id"> & { id: number } =>
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
  relatedResources,
}: {
  resource: T;
  defaultValues: DefaultValues<ResourceDataType<T> | ResourceFormValues<T>>;
  existingImages: ExistingImages<T>;
  relatedResources: ResourceRelations<T>;
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

  const metadata = getResourceMetadata(resource);
  const {
    imageInputs,
    textInputs,
    textareaInputs,
    richTextInputs,
    dateInputs,
    dateTimeInputs,
    colorInputs,
    selectInputs,
    checkboxInputs,
    relationInputs,
  } = metadata.form.inputs;

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
                <Inputs
                  inputs={imageInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
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
                  )}
                />
              </div>
              <div className="w-full space-y-4">
                <Inputs
                  inputs={textInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{input.label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Wpisz tekst..."
                              className="bg-background"
                              {...field}
                              value={(field.value ?? "") as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
                <Inputs
                  inputs={textareaInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{input.label}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Wpisz tekst..."
                              className="bg-background"
                              {...field}
                              value={(field.value ?? "") as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
                <Inputs
                  container
                  inputs={dateInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
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
                <Inputs
                  inputs={dateTimeInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
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
                  )}
                />
                <Inputs
                  inputs={richTextInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
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
                              placeholder="Wpisz opis..."
                              editable
                              editorClassName="focus:outline-hidden"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
                <Inputs
                  container
                  inputs={colorInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
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
                <Inputs
                  container
                  className="grid grid-cols-1 lg:grid-cols-2"
                  inputs={selectInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
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
                              <SelectTrigger className="bg-background w-full">
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
                <Inputs
                  inputs={checkboxInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
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
                  )}
                />
                <Inputs
                  container
                  className="grid grid-cols-1 lg:grid-cols-2"
                  inputs={relationInputs}
                  mapper={([relation]) => {
                    const resourceRelation = relation as ResourceRelation<T>;
                    const relationData = relatedResources[resourceRelation];
                    const config = RELATED_RESOURCE_METADATA[relation];
                    const relationDeclined = {
                      singular: declineNoun(relation, { plural: false }),
                      plural: declineNoun(relation, { plural: true }),
                    };
                    const primaryKeyField =
                      (config as RelationConfiguration<ResourceRelation<T>>)
                        .pk ?? "id";
                    const selectedValues = isExistingResourceItem(defaultValues)
                      ? (
                          defaultValues as unknown as ResourceDataType<T> &
                            QueriedRelations<T>
                        )[config.name].map((item) =>
                          String(
                            get(item, primaryKeyField, "unknown-select-item"),
                          ),
                        )
                      : [];
                    return (
                      <Label
                        asChild
                        key={`${resource}-multiselect-${relation}`}
                      >
                        <div className="flex-col items-start">
                          {toTitleCase(relationDeclined.plural.nominative)}
                          <MultiSelect
                            deduplicateOptions
                            hideSelectAll
                            placeholder={`Wybierz ${relationDeclined.singular.accusative}`}
                            className="bg-background border-input"
                            options={relationData.map((option, index) => {
                              const label: string = get(
                                option,
                                config.displayField,
                                "",
                              ) as string;
                              const value = String(
                                get(
                                  option,
                                  primaryKeyField,
                                  `item-${String(index)}`,
                                ),
                              );
                              return { label, value };
                            })}
                            onOptionToggled={(value, removed) => {
                              // TODO: implement on value toggled
                              // eslint-disable-next-line no-console
                              console.log(
                                "option",
                                removed ? "removed:" : "added:",
                                value,
                              );
                            }}
                            onValueChange={(values) => {
                              // TODO: implement on change
                              // eslint-disable-next-line no-console
                              console.log("new select values:", values);
                            }}
                            defaultValue={selectedValues}
                          />
                        </div>
                      </Label>
                    );
                  }}
                />
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
