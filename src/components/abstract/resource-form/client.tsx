"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { get, useForm } from "react-hook-form";
import type { DefaultValues, Resolver } from "react-hook-form";
import { toast } from "sonner";

import { DeleteButtonWithDialog } from "@/components/abstract/delete-button-with-dialog";
import { CheckboxInput } from "@/components/inputs/checkbox-input";
import { ColorInput } from "@/components/inputs/color-input";
import { DatePicker } from "@/components/inputs/date-picker";
import { DateTimePicker } from "@/components/inputs/date-time-picker";
import { ImageUpload } from "@/components/inputs/image-upload";
import { Inputs } from "@/components/inputs/input-row";
import { RelationInput } from "@/components/inputs/relation-input";
import { SelectInput } from "@/components/inputs/select-input";
import { SelectOptions } from "@/components/inputs/select-options";
import { ArfSheetProvider } from "@/components/providers/arf-sheet-provider";
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Textarea } from "@/components/ui/textarea";
import { TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useArfRelation } from "@/hooks/use-arf-relation";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import {
  getDefaultValues,
  getMutationConfig,
  isExistingResourceItem,
} from "@/lib/abstract-resource-form";
import { fetchMutation } from "@/lib/fetch-utils";
import { getResourceMetadata, getResourcePk, sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import { RESOURCE_SCHEMAS } from "@/schemas";
import type { ModifyResourceResponse } from "@/types/api";
import type {
  Id,
  RelationDefinition,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourceRelation,
  RoutableResource,
} from "@/types/app";
import type {
  ExistingImages,
  ResourceFormProps,
  ResourceRelations,
} from "@/types/components";

export function AbstractResourceFormInternal<T extends Resource>({
  resource,
  defaultValues,
  existingImages,
  relatedResources,
  className,
}: ResourceFormProps<T> & {
  defaultValues: ResourceDefaultValues<T>;
  existingImages: ExistingImages<T>;
  relatedResources: ResourceRelations<T>;
}) {
  const schema = RESOURCE_SCHEMAS[resource];
  const router = useRouter();
  const relationContext = useArfRelation();
  const form = useForm<ResourceFormValues<T>>({
    // Maybe try extracting the id from the defaultValues and passing it as an editedResourceId prop?
    // @ts-expect-error TODO: the schema is compatible but for some reason the types don't match
    resolver: zodResolver(schema) as Resolver<ResourceFormValues<T>>,
    defaultValues: getDefaultValues(
      defaultValues,
      relationContext,
    ) as DefaultValues<ResourceFormValues<T>>,
  });

  const isEditing = isExistingResourceItem(resource, defaultValues);
  const isEmbedded = relationContext != null;

  const {
    mutationKey,
    endpoint,
    submitLabel,
    SubmitIconComponent,
    ...mutationOptions
  } = getMutationConfig(resource, defaultValues, relationContext);

  const { mutateAsync, isPending } = useMutationWrapper<
    ModifyResourceResponse<T>,
    ResourceFormValues<T>
  >(mutationKey, async (body) => {
    const response = await fetchMutation<ModifyResourceResponse<T>>(endpoint, {
      body,
      resource,
      ...mutationOptions,
    });
    const wasCreated = mutationOptions.method === "POST";
    // initially disables the save button after successful edit
    form.reset(wasCreated ? undefined : response.data);
    if (relationContext == null && wasCreated) {
      router.push(`/${resource}/edit/${sanitizeId(response.data.id)}`);
    } else {
      if (wasCreated && relationContext != null) {
        relationContext.closeSheet();
        setTimeout(() => {
          // allow time for the sheet to close before refreshing
          router.refresh();
        }, 300);
      } else {
        router.refresh();
      }
    }
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
    <ArfSheetProvider
      resource={resource}
      className={cn("mx-auto flex h-full flex-col", className)}
    >
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
            <div
              className={cn(
                "bg-background-secondary flex min-h-full flex-col gap-4 rounded-xl p-4",
                { "md:flex-row": !isEmbedded },
              )}
            >
              <Inputs
                container
                className="flex-col"
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
                              editorContentClassName="p-4"
                              placeholder="Wpisz opis..."
                              aria-label={input.label}
                              editable
                              output="html"
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
                  inputs={checkboxInputs}
                  mapper={([name, input]) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <CheckboxInput
                          value={(field.value ?? false) as boolean}
                          label={input.label}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  )}
                />
                {selectInputs == null && relationInputs == null ? null : (
                  <div
                    className={cn("grid grid-cols-1 items-start gap-4", {
                      "lg:grid-cols-2": !isEmbedded,
                    })}
                  >
                    <Inputs
                      inputs={selectInputs}
                      mapper={([name, input]) => (
                        <SelectInput
                          key={name}
                          control={form.control}
                          name={name}
                          label={input.label}
                          options={<SelectOptions input={input} />}
                        />
                      )}
                    />
                    <Inputs
                      inputs={relationInputs}
                      mapper={([resourceRelation, relationDefinition]) => (
                        <RelationInput
                          key={`${resource}-multiselect-${resourceRelation}`}
                          resource={resource}
                          // these type assertions are needed because the values are extracted from RESOURCE_METADATA
                          // the types are inferred from the structure of RESOURCE_METADATA, so they are fundamentally equivalent
                          resourceRelation={
                            resourceRelation as ResourceRelation<T>
                          }
                          relationDefinition={
                            relationDefinition as RelationDefinition<
                              T,
                              typeof resourceRelation
                            >
                          }
                          relatedResources={relatedResources}
                          control={form.control}
                          defaultValues={defaultValues}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={cn(
              "flex w-full items-center gap-x-4 gap-y-2 max-sm:flex-col",
              {
                "w-full flex-col items-stretch gap-y-4": isEmbedded,
              },
            )}
          >
            {isEmbedded ? null : (
              <Button
                variant="link"
                className="text-primary hover:text-primary mr-4 sm:mr-auto"
                size="sm"
                asChild
              >
                {/* It would be too complex to relate `isEmbedded` to `resource` being a `RoutableResource`, */}
                {/* so I'm going to assume the codebase won't use `AbstractResourceForm` anywhere except for */}
                {/* routable resources with `isEmbedded` set to `false` and otherwise with it set to `true`. */}
                <Link href={`/${resource as RoutableResource}`}>
                  <ChevronLeft />
                  Wróć do{" "}
                  {declineNoun(resource, {
                    case: DeclensionCase.Genitive,
                    plural: true,
                  })}
                </Link>
              </Button>
            )}
            {isEditing ? (
              <DeleteButtonWithDialog
                resource={resource}
                id={get(defaultValues, getResourcePk(resource)) as Id}
                showLabel
                size="default"
                {...(isEmbedded
                  ? {
                      variant: "destructive",
                      onDeleteSuccess: async () => {
                        relationContext.closeSheet();
                        // Give time for the sheet to close before resolving the deletion (triggers refresh)
                        await new Promise((resolve) =>
                          setTimeout(resolve, 300),
                        );
                        return true;
                      },
                      itemName: metadata.itemMapper(defaultValues).name,
                    }
                  : {
                      onDeleteSuccess: () => {
                        router.push(`/${resource}`);
                        return false;
                      },
                    })}
              />
            ) : null}
            <Button
              type="submit"
              loading={isPending}
              disabled={!form.formState.isDirty}
            >
              {submitLabel} {declensions.accusative} <SubmitIconComponent />
            </Button>
          </div>
        </form>
      </Form>
    </ArfSheetProvider>
  );
}
