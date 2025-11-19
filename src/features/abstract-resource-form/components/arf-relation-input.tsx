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
  getResourceQueryName,
} from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
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
import { sanitizeId, toTitleCase } from "@/utils";

import { useArfRelation } from "../hooks/use-arf-relation";
import { useArfRelationMutation } from "../hooks/use-arf-relation-mutation";
import { useArfSheet } from "../hooks/use-arf-sheet";
import { getMutationConfig } from "../utils/get-mutation-config";
import { isExistingItem } from "../utils/is-existing-item";
import { ArfInput } from "./arf-input";
import { ArfPivotData } from "./arf-pivot-data";

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
  if (relationDefinition.type === RelationType.ManyToOne) {
    const selectLabel = toTitleCase(relationDeclined.singular.nominative);
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
  const inputLabel = toTitleCase(relationDeclined.plural.nominative);
  if (!isEditing) {
    return (
      <PendingInput
        label={inputLabel}
        message={`${toTitleCase(relationDeclined.plural.accusative)} można dodać po utworzeniu ${declensions.genitive}.`}
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
    // TODO: ensure this never happens
    logger.error(
      {
        resource,
        relation: resourceRelation,
        defaultValues,
      },
      "Expected relation values to be present in defaultValues but they are missing.",
      "This is a bug - please report to Konrad Guzek.",
    );
  }
  const queriedRelations = unsafeQueriedRelations ?? [];
  const selectedValues = queriedRelations.flatMap((item) => {
    const value = get(item, primaryKeyField, null) as ResourcePk | null;
    return value == null ? [] : String(value);
  });
  const relationDataOptions =
    relationDefinition.type === RelationType.OneToMany
      ? queriedRelations
      : allRelatedData;
  const formProps = {
    resource: resourceRelation,
    className: "w-full px-4",
  } satisfies ResourceFormProps<L>;
  const multiselect = (
    <MultiSelect
      deduplicateOptions
      hideSelectAll
      isReadOnly={
        relationDefinition.type === RelationType.OneToMany ||
        relationDefinition.pivotData != null
      }
      animationConfig={{
        badgeAnimation: "none",
      }}
      placeholder={inputPlaceholder}
      emptyIndicator={`Brak ${relationDeclined.plural.genitive} spełniających wyszukanie.`}
      options={relationDataOptions.map((option, index) => {
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
      })}
      onOptionToggled={async (id, deleted) => {
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
      }}
      defaultValue={[...new Set(selectedValues)]}
    />
  );
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
