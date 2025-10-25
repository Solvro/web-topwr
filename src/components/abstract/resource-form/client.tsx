"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, FilePlus2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { get, useForm } from "react-hook-form";
import type { DefaultValues, Resolver } from "react-hook-form";
import { toast } from "sonner";

import { CheckboxInput } from "@/components/inputs/checkbox-input";
import { ColorInput } from "@/components/inputs/color-input";
import { DatePicker } from "@/components/inputs/date-picker";
import { DateTimePicker } from "@/components/inputs/date-time-picker";
import { ImageUpload } from "@/components/inputs/image-upload";
import { Inputs } from "@/components/inputs/input-row";
import { SelectInput } from "@/components/inputs/select-input";
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
import { Label } from "@/components/ui/label";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { MultiSelect } from "@/components/ui/multi-select";
import { SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase, RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useArfContext } from "@/hooks/use-abstract-resource-form";
import type { RelationContext } from "@/hooks/use-abstract-resource-form";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { renderAbstractResourceForm } from "@/lib/actions";
import { fetchMutation } from "@/lib/fetch-utils";
import { camelToSnakeCase, sanitizeId, toTitleCase } from "@/lib/helpers";
import {
  getResourceMetadata,
  getResourcePk,
  getResourceQueryName,
  getResourceRelationDefinitions,
} from "@/lib/helpers/app";
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import { RESOURCE_SCHEMAS } from "@/schemas";
import type { ModifyResourceResponse } from "@/types/api";
import type {
  Id,
  QueriedRelations,
  ResourceDataType,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourceRelation,
  RoutableResource,
  XToManyResource,
} from "@/types/app";
import type {
  ExistingImages,
  ResourceFormProps,
  ResourceFormSheetData,
  ResourceFormSheetDataContent,
  ResourceRelations,
} from "@/types/components";

import { AbstractResourceFormSheet } from "./sheet";

const isExistingResourceItem = <T extends Resource>(
  resource: T,
  item: ResourceDefaultValues<T>,
): item is ResourceDataType<T> & QueriedRelations<T> => {
  const value = get(item, getResourcePk(resource)) as unknown;
  return value != null && value !== "";
};

const getEditConfig = <T extends Resource>(
  resource: T,
  defaultValues: ResourceDataType<T>,
) => {
  const unsanitizedPkValue = (get(defaultValues, getResourcePk(resource)) ??
    defaultValues.id) as string | undefined;
  if (unsanitizedPkValue == null || unsanitizedPkValue === "") {
    throw new Error(
      `Cannot obtain primary key value while editing resource: ${JSON.stringify(defaultValues)}`,
    );
  }
  const pkValue = sanitizeId(unsanitizedPkValue);
  return {
    mutationKey: `update__${resource}__${pkValue}`,
    endpoint: pkValue,
    method: "PATCH",
    submitLabel: "Zapisz",
    SubmitIconComponent: Save,
  } as const;
};

const getCreateConfig = <T extends Resource>(resource: T) =>
  ({
    mutationKey: `create__${resource}`,
    endpoint: "/",
    method: "POST",
    submitLabel: "Utwórz",
    SubmitIconComponent: FilePlus2,
  }) as const;

const getMutationConfig = <T extends Resource>(
  resource: T,
  defaultValues: ResourceDefaultValues<T>,
  relationContext: RelationContext<T> | null,
) => {
  const isEditing = isExistingResourceItem(resource, defaultValues);
  const parentConfig = isEditing
    ? getEditConfig(resource, defaultValues)
    : getCreateConfig(resource);
  if (relationContext == null || isEditing) {
    // always fetch the resource directly if editing a related resource
    // e.g. PATCH /api/v1/student_organization_links
    return parentConfig;
  }
  const relationDefinition = getResourceRelationDefinitions(
    relationContext.parentResource,
  )[relationContext.childResource];
  if (relationDefinition.type !== RelationType.OneToMany) {
    // only 1:n relations need special handling when creating a related resource
    return parentConfig;
  }
  // fetch the parent resource when creating a related resource
  // e.g. POST /api/v1/student_organizations/{parentId}/tags
  const queryName = getResourceQueryName(
    relationContext.childResource as XToManyResource,
  );
  // of course the backend uses camelCase for query params but snake_case for path segments...
  const pathSegment = camelToSnakeCase(queryName);
  const config = {
    ...parentConfig,
    endpoint: `${sanitizeId(relationContext.parentResourceId)}/${pathSegment}`,
    resource: relationContext.parentResource,
  } as const;
  return config;
};

const getDefaultValues = <T extends Resource>(
  defaultValues: ResourceDefaultValues<T>,
  relationContext: RelationContext<T> | null,
) => {
  if (relationContext == null) {
    return defaultValues;
  }
  const {
    parentResource,
    childResource,
    parentResourceId: parentResourcePkValue,
  } = relationContext;
  const relationDefinitions = getResourceRelationDefinitions(parentResource);
  const relationDefinition = relationDefinitions[childResource];
  if (relationDefinition.type !== RelationType.OneToMany) {
    return defaultValues;
  }
  const foreignKey = relationDefinition.foreignKey;
  const combinedDefaultValues = {
    ...defaultValues,
    [foreignKey]: parentResourcePkValue,
  };
  return combinedDefaultValues;
};

export function AbstractResourceFormInternal<T extends Resource>({
  resource,
  defaultValues,
  existingImages,
  relatedResources,
  isEmbedded = false,
  className,
}: ResourceFormProps<T> & {
  defaultValues: ResourceDefaultValues<T>;
  existingImages: ExistingImages<T>;
  relatedResources: ResourceRelations<T>;
}) {
  const schema = RESOURCE_SCHEMAS[resource];
  const router = useRouter();
  const [sheet, setSheet] = useState<ResourceFormSheetData<T>>({
    visible: false,
  });
  const { relationContext } = useArfContext();
  const form = useForm<ResourceFormValues<T>>({
    // Maybe try extracting the id from the defaultValues and passing it as an editedResourceId prop?
    // @ts-expect-error TODO: the schema is compatible but for some reason the types don't match
    resolver: zodResolver(schema) as Resolver<ResourceFormValues<T>>,
    defaultValues: getDefaultValues(
      defaultValues,
      relationContext,
    ) as DefaultValues<ResourceFormValues<T>>,
  });

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
      router.push(`/${resource}/edit/${sanitizeId(String(response.data.id))}`);
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

  const relationMutation = useMutationWrapper<
    ModifyResourceResponse<T>,
    {
      deleted: boolean;
      id: Id;
      resourceRelation: ResourceRelation<T>;
    }
  >(
    `update__${resource}__relation__${relationContext?.childResource ?? "unknown"}`,
    async ({ deleted, id, resourceRelation }) => {
      const relationInputs = getResourceRelationDefinitions(resource);
      const relationDefinition = relationInputs[resourceRelation];
      if (relationDefinition.type !== RelationType.ManyToMany) {
        throw new Error(
          "Only many-to-many relations are allowed to have non-readonly multiselects.",
        );
      }
      const queryName = getResourceQueryName(
        resourceRelation as XToManyResource,
      );
      const pathSegment = camelToSnakeCase(queryName);
      const response = await fetchMutation<ModifyResourceResponse<T>>(
        `${endpoint}/${pathSegment}/${sanitizeId(String(id))}`,
        {
          method: deleted ? "DELETE" : "POST",
          resource,
          body: relationDefinition.pivotData,
        },
      );
      return response;
    },
  );
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

  function showSheet(
    options: Omit<ResourceFormSheetDataContent<T>, "form">,
    ...formProps: Parameters<typeof renderAbstractResourceForm>
  ) {
    const formPromise = renderAbstractResourceForm(...formProps);
    setSheet({ visible: true, content: { ...options, form: formPromise } });
  }

  return (
    <div className={cn("mx-auto flex h-full flex-col", className)}>
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
                          options={Object.values(input.optionEnum).map(
                            (option) => (
                              <SelectItem key={option} value={String(option)}>
                                {input.optionLabels[option]}
                              </SelectItem>
                            ),
                          )}
                        />
                      )}
                    />
                    <Inputs
                      inputs={relationInputs}
                      mapper={([relation, relationDefinition]) => {
                        const resourceRelation =
                          relation as ResourceRelation<T>;
                        const relationData = relatedResources[resourceRelation];
                        const config = getResourceMetadata(resourceRelation);
                        const relationDeclined = {
                          singular: declineNoun(relation, { plural: false }),
                          plural: declineNoun(relation, { plural: true }),
                        };
                        const isEditingParentResource = isExistingResourceItem(
                          resource,
                          defaultValues,
                        );
                        if (
                          relationDefinition.type === RelationType.ManyToOne
                        ) {
                          return (
                            <SelectInput
                              control={form.control}
                              key={relationDefinition.foreignKey}
                              name={relationDefinition.foreignKey}
                              label={toTitleCase(
                                relationDeclined.singular.nominative,
                              )}
                              options={Object.values(relationData).map(
                                (option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={sanitizeId(option.id)}
                                  >
                                    {config.itemMapper(option).name}
                                  </SelectItem>
                                ),
                              )}
                            />
                          );
                        }
                        const primaryKeyField = getResourcePk(relation);
                        const inputLabel = toTitleCase(
                          relationDeclined.plural.nominative,
                        );
                        const elementKey = `${resource}-multiselect-${relation}`;
                        if (!isEditingParentResource) {
                          return (
                            <Label key={elementKey} asChild>
                              <div className="flex-col items-stretch">
                                {inputLabel}
                                <div className="text-foreground/50 py-2 text-center">
                                  {toTitleCase(
                                    relationDeclined.plural.accusative,
                                  )}{" "}
                                  można dodać po utworzeniu{" "}
                                  {declensions.genitive}.
                                </div>
                              </div>
                            </Label>
                          );
                        }
                        // When it's a m:n relation, we can reuse relation data that already exists
                        // For 1:n relation, we will be creating items specifically for this resource
                        const action =
                          relationDefinition.type === RelationType.OneToMany
                            ? "Dodaj"
                            : "Wybierz";
                        const inputPlaceholder = `${action} ${relationDeclined.singular.accusative}`;
                        const unsafeRelationValues = defaultValues[
                          getResourceQueryName(relation as XToManyResource)
                        ] as ResourceDataType<typeof relation>[] | undefined;
                        if (unsafeRelationValues == null) {
                          // TODO: ensure this never happens
                          console.warn(
                            "Expected relation values to be present in defaultValues but they are missing.",
                            "This is a bug - please report to Konrad Guzek.",
                            {
                              resource,
                              relation,
                              defaultValues,
                            },
                          );
                        }
                        const relationValues = unsafeRelationValues ?? [];
                        const selectedValues = relationValues.map((item) =>
                          String(
                            get(item, primaryKeyField, "unknown-select-item"),
                          ),
                        );
                        const relationDataOptions =
                          relationDefinition.type === RelationType.OneToMany
                            ? relationValues
                            : relationData;
                        const formProps = {
                          resource: relation,
                          isEmbedded: true,
                          className: "w-full px-4",
                        } satisfies ResourceFormProps<Resource>;
                        return (
                          <Label
                            key={elementKey}
                            className="flex-col items-start"
                          >
                            {inputLabel}
                            <MultiSelect
                              deduplicateOptions
                              hideSelectAll
                              isReadOnly={
                                relationDefinition.type ===
                                RelationType.OneToMany
                              }
                              animationConfig={{
                                badgeAnimation: "none",
                              }}
                              placeholder={inputPlaceholder}
                              emptyIndicator={`Brak ${relationDeclined.plural.genitive} spełniających wyszukanie.`}
                              options={relationDataOptions.map(
                                (option, index) => {
                                  const label =
                                    config.itemMapper(
                                      option as ResourceDataType<
                                        typeof resourceRelation
                                      >,
                                    ).name ?? JSON.stringify(option);
                                  const value = String(
                                    get(
                                      option,
                                      primaryKeyField,
                                      `item-${String(index)}`,
                                    ),
                                  );
                                  return { label, value };
                                },
                              )}
                              onOptionToggled={async (value, removed) => {
                                const { unwrap } = toast.promise(
                                  relationMutation.mutateAsync({
                                    id: value,
                                    deleted: removed,
                                    resourceRelation,
                                  }),
                                  TOAST_MESSAGES.object(
                                    relationDeclined.singular,
                                  ).modify,
                                );
                                try {
                                  await unwrap();
                                  return true;
                                } catch {
                                  return false;
                                }
                              }}
                              onValueChange={() => {
                                toast.info(
                                  "Zmiana wszystkich wartości na raz nie jest jeszcze dostępna. Dodawaj lub usuwaj pojedynczo.",
                                );
                                return false;
                              }}
                              onCreateItem={() => {
                                showSheet(
                                  {
                                    item: null,
                                    childResource: resourceRelation,
                                    parentResourceData: defaultValues,
                                  },
                                  formProps,
                                );
                              }}
                              onEditItem={(value) => {
                                const relationDefaultValues =
                                  relationDataOptions.find(
                                    (option) =>
                                      value ===
                                      String(get(option, primaryKeyField)),
                                  ) as
                                    | ResourceDataType<typeof resourceRelation>
                                    | undefined;
                                const label =
                                  relationDefaultValues == null
                                    ? undefined
                                    : config.itemMapper(relationDefaultValues)
                                        .name;
                                showSheet(
                                  {
                                    item: {
                                      name: label,
                                      id: value,
                                    },
                                    childResource: resourceRelation,
                                    parentResourceData: defaultValues,
                                  },
                                  {
                                    ...formProps,
                                    defaultValues: {
                                      ...relationDefaultValues,
                                      [getResourcePk(relation)]: value,
                                    } as ResourceDefaultValues<Resource>,
                                  },
                                );
                              }}
                              defaultValue={selectedValues}
                            />
                          </Label>
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between">
            {isEmbedded ? null : (
              <Button
                variant="link"
                className="text-primary hover:text-primary w-min"
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
            <Button
              type="submit"
              loading={isPending}
              disabled={!form.formState.isDirty}
              className={cn({ "w-full": isEmbedded })}
            >
              {submitLabel} {declensions.accusative} <SubmitIconComponent />
            </Button>
          </div>
        </form>
      </Form>
      <AbstractResourceFormSheet
        resource={resource}
        sheet={sheet}
        setSheet={setSheet}
      />
    </div>
  );
}
