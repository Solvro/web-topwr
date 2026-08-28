import type { ReactNode } from "react";
import { get } from "react-hook-form";
import type { Control } from "react-hook-form";
import { toast } from "sonner";

import { PendingInput } from "@/components/inputs/pending-input";
import { SelectInput } from "@/components/inputs/select-input";
import { FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import type { SetOptionSelected } from "@/components/ui/multi-select";
import { SelectItem } from "@/components/ui/select";
import { logger } from "@/features/logging";
import { declineNoun } from "@/features/polish";
import {
  RelationType,
  getResourceMetadata,
  getResourcePk,
  getResourcePkValue,
  getResourceQueryName,
  isOrderableResource,
} from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  OrderableResource,
  RelationDefinition,
  ResourceDataType,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourcePivotRelationData,
  ResourcePk,
  ResourceRelation,
  XToManyResource,
} from "@/features/resources/types";
import type { ResourceFormProps, ResourceRelations } from "@/types/components";
import { capitalizeFirstLetter, sanitizeId } from "@/utils";

import { useArfRelation } from "../hooks/use-arf-relation";
import { useArfRelationMutation } from "../hooks/use-arf-relation-mutation";
import { useArfSheet } from "../hooks/use-arf-sheet";
import { getItemPivotOrder } from "../utils/get-item-pivot-order";
import { getMutationConfig } from "../utils/get-mutation-config";
import { isExistingItem } from "../utils/is-existing-item";
import { ArfInput } from "./arf-input";
import { ArfPivotData } from "./arf-pivot-data";
import { OrderableMultiSelect } from "./orderable-multi-select";
import { OrderablePivotMultiSelect } from "./orderable-pivot-multi-select";

export function ArfRelationInput<
  T extends Resource,
  L extends ResourceRelation<T>,
>({
  resource,
  resourceRelation,
  relatedResources,
  pivotResources,
  relationDefinition,
  control,
  defaultValues,
}: {
  resource: T;
  resourceRelation: L;
  relatedResources: ResourceRelations<T>;
  pivotResources: ResourcePivotRelationData<T>;
  relationDefinition: RelationDefinition<T, L>;
  control: Control<ResourceFormValues<T>>;
  defaultValues: ResourceDefaultValues<T>;
}) {
  const { showSheet } = useArfSheet<T>(resource);
  const relationContext = useArfRelation();

  const { endpoint } = getMutationConfig(
    resource,
    defaultValues,
    relationContext,
  );

  const { mutateRelation } = useArfRelationMutation({
    resource,
    resourceRelation,
    endpoint,
  });

  const declensions = declineNoun(resource);
  const allRelatedData = relatedResources[resourceRelation];
  const config = getResourceMetadata(resourceRelation);
  const relationDeclined = {
    singular: declineNoun(resourceRelation, { plural: false }),
    plural: declineNoun(resourceRelation, { plural: true }),
  };
  const isEditing = isExistingItem(resource, defaultValues);
  if (
    relationDefinition.type === RelationType.ManyToOne ||
    relationDefinition.type === RelationType.OneToOne
  ) {
    const selectLabel = capitalizeFirstLetter(
      relationDeclined.singular.nominative,
    );
    return (
      <FormField
        control={control}
        name={relationDefinition.foreignKey}
        render={({ field }) => (
          <ArfInput
            declensions={declensions}
            isEditing={isEditing}
            inputDefinition={{ label: selectLabel, ...relationDefinition }}
          >
            <SelectInput
              {...field}
              label={selectLabel}
              options={Object.values(allRelatedData).map((option) => (
                <SelectItem key={option.id} value={sanitizeId(option.id)}>
                  {config.itemMapper(option).name}
                </SelectItem>
              ))}
            />
          </ArfInput>
        )}
      />
    );
  }
  const inputLabel = capitalizeFirstLetter(relationDeclined.plural.nominative);
  if (!isEditing) {
    return (
      <PendingInput
        label={inputLabel}
        message={`${capitalizeFirstLetter(relationDeclined.plural.accusative)} można dodać po utworzeniu ${declensions.genitive}.`}
      />
    );
  }
  const primaryKeyField = getResourcePk(resourceRelation);
  // When it's a m:n relation, we can reuse relation data that already exists
  // For 1:n relation, we will be creating items specifically for this resource
  const action =
    relationDefinition.type === RelationType.OneToMany ? "Dodaj" : "Wybierz";
  const inputPlaceholder = `${action} ${relationDeclined.singular.accusative}`;
  const unsafeQueriedRelations = defaultValues[
    getResourceQueryName(resourceRelation as XToManyResource)
  ] as ResourceDataType<L>[] | undefined;

  if (unsafeQueriedRelations == null) {
    logger.warn(
      { resource, relation: resourceRelation },
      "Relation values missing in parent payload. Falling back to manual filtering of allRelatedData.",
    );
  }

  const parentPkValue = getResourcePkValue(resource, defaultValues);
  const fallbackRelations = Object.values(allRelatedData).filter(
    (item) =>
      sanitizeId(String(get(item, relationDefinition.foreignKey))) ===
      parentPkValue,
  ) as ResourceDataType<L>[];

  const queriedRelations = unsafeQueriedRelations ?? fallbackRelations;
  const isRelationOrderable =
    isOrderableResource(resourceRelation) &&
    relationDefinition.type !== RelationType.ManyToMany;
  const isPivotOrderable =
    relationDefinition.type === RelationType.ManyToMany &&
    relationDefinition.orderable === true;
  const sortedQueriedRelations = isRelationOrderable
    ? [...queriedRelations].toSorted((a, b) =>
        "order" in a && "order" in b ? a.order - b.order : 1,
      )
    : isPivotOrderable
      ? [...queriedRelations].toSorted((a, b) => {
          const orderA = getItemPivotOrder(a);
          const orderB = getItemPivotOrder(b);
          if (orderA !== undefined && orderB !== undefined) {
            return orderA - orderB;
          }
          return 1;
        })
      : queriedRelations;
  const selectedValues = sortedQueriedRelations.flatMap((item) => {
    const value = get(item, primaryKeyField, null) as ResourcePk | null;
    return value == null ? [] : String(value);
  });
  const relationDataOptions =
    relationDefinition.type === RelationType.OneToMany
      ? sortedQueriedRelations
      : allRelatedData;
  const formProps = {
    resource: resourceRelation,
    className: "w-full px-4",
  } satisfies ResourceFormProps<L>;
  const multiSelectProps = {
    deduplicateOptions: true,
    hideSelectAll: true,
    isReadOnly:
      relationDefinition.type === RelationType.OneToMany ||
      relationDefinition.pivotData != null,
    animationConfig: {
      badgeAnimation: "none" as const,
    },
    placeholder: inputPlaceholder,
    emptyIndicator: `Brak ${relationDeclined.plural.genitive} spełniających wyszukanie.`,
    options: relationDataOptions.map((option, index) => {
      const label = config.itemMapper(option).name ?? JSON.stringify(option);
      const value = String(
        get(option, primaryKeyField, `item-${String(index)}`),
      );
      const queriedRelationData =
        relationDefinition.type === RelationType.OneToMany
          ? option
          : queriedRelations.find(
              (queriedRelation) => queriedRelation.id === option.id,
            );
      return {
        label,
        value,
        action: (setOptionSelected: SetOptionSelected) => (
          <ArfPivotData
            resource={resource}
            endpoint={endpoint}
            resourceRelation={resourceRelation}
            pivotResources={pivotResources}
            queriedRelationData={queriedRelationData}
            optionValue={value}
            setOptionSelected={setOptionSelected}
            aria-label={`Ustaw relację między ${declensions.instrumental} a ${relationDeclined.singular.instrumental} ${label}`}
          />
        ),
      };
    }),
    onOptionToggled: async (id: string, deleted: boolean) => {
      if (relationDefinition.type !== RelationType.ManyToMany) {
        toast.error(
          `Nastąpił nieoczekiwany błąd: dodanie ${relationDeclined.singular.genitive} obecnie nie jest możliwe. Proszę zgłosić ten błąd deweloperom.`,
        );
        return false;
      }
      try {
        await mutateRelation({
          id,
          deleted,
          body: undefined,
        });
        return true;
      } catch {
        return false;
      }
    },
    onValueChange: () => {
      toast.info(
        "Zmiana wszystkich wartości na raz nie jest jeszcze dostępna. Dodawaj lub usuwaj pojedynczo.",
      );
      return false;
    },
    onCreateItem: () => {
      showSheet(
        {
          item: null,
          childResource: resourceRelation,
          parentResourceData: defaultValues,
        },
        formProps,
      );
    },
    onEditItem: (value: string) => {
      const relationDefaultValues = relationDataOptions.find(
        (option) => value === String(get(option, primaryKeyField)),
      );
      const label =
        relationDefaultValues == null
          ? undefined
          : config.itemMapper(relationDefaultValues).name;
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
            [getResourcePk(resourceRelation)]: value,
          } as ResourceDefaultValues<Resource>,
        },
      );
    },
    defaultValue: [...new Set(selectedValues)],
  } satisfies React.ComponentProps<typeof MultiSelect>;

  let multiselect: ReactNode;
  if (isRelationOrderable) {
    multiselect = (
      <OrderableMultiSelect
        resourceRelation={resourceRelation as OrderableResource}
        items={sortedQueriedRelations as ResourceDataType<OrderableResource>[]}
        multiSelectProps={multiSelectProps}
      />
    );
  } else if (isPivotOrderable && relationDefinition.pivotData != null) {
    multiselect = (
      <OrderablePivotMultiSelect
        resource={resource}
        resourceRelation={resourceRelation}
        endpoint={endpoint}
        pivotData={relationDefinition.pivotData}
        items={sortedQueriedRelations}
        multiSelectProps={multiSelectProps}
      />
    );
  } else {
    multiselect = <MultiSelect {...multiSelectProps} />;
  }
  return relationDefinition.type === RelationType.ManyToMany ? (
    // TODO: allow m:n relation inputs to be immutable
    <Label className="flex-col items-start">
      {inputLabel}
      {multiselect}
    </Label>
  ) : (
    <FormField
      control={control}
      name={relationDefinition.foreignKey}
      render={() => (
        <ArfInput
          declensions={declensions}
          isEditing={isEditing}
          inputDefinition={{ label: inputLabel, ...relationDefinition }}
        >
          {multiselect}
        </ArfInput>
      )}
    />
  );
}
