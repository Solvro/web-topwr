"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { get, useForm } from "react-hook-form";
import type { DefaultValues, Resolver } from "react-hook-form";
import { toast } from "sonner";

import { ReturnButton } from "@/components/presentation/return-button";
import { Form } from "@/components/ui/form";
import { fetchMutation, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import {
  DeleteButtonWithDialog,
  RESOURCE_SCHEMAS,
  getResourceMetadata,
  getResourcePk,
} from "@/features/resources";
import type {
  EditableResource,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourcePivotRelationData,
  ResourcePk,
  RoutableResource,
} from "@/features/resources/types";
import { useRouter } from "@/hooks/use-router";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { getToastMessages } from "@/lib/get-toast-messages";
import { cn } from "@/lib/utils";
import type {
  ExistingImages,
  ResourceFormProps,
  ResourceRelations,
} from "@/types/components";
import { sanitizeId } from "@/utils";

import { useArfRelation } from "../hooks/use-arf-relation";
import { ArfSheetProvider } from "../providers/arf-sheet-provider";
import { getDefaultValues } from "../utils/get-default-values";
import { getMutationConfig } from "../utils/get-mutation-config";
import { isExistingItem } from "../utils/is-existing-item";
import { isFormStateDirty } from "../utils/is-form-state-dirty";
import { ArfBody } from "./arf-body";
import { ArfConfirmationModal } from "./arf-confirmation-modal";

/** Controller component for Abstract Resource Form. Sets up form context and handles submission. */
export function ArfController<T extends Resource>({
  resource,
  defaultValues,
  existingImages,
  relatedResources,
  pivotResources,
  className,
}: ResourceFormProps<T> & {
  defaultValues: ResourceDefaultValues<T>;
  existingImages: ExistingImages<T>;
  relatedResources: ResourceRelations<T>;
  pivotResources: ResourcePivotRelationData<T>;
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
  const { setHasUnsavedChanges } = useUnsavedChanges();

  const isEditing = isExistingItem(resource, defaultValues);
  const isEmbedded = relationContext != null;
  const { subscribe } = form;

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { isDirty: true, dirtyFields: true },
      callback: (formState) => {
        setHasUnsavedChanges(isFormStateDirty(formState));
      },
    });

    return () => {
      unsubscribe();
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges, subscribe]);

  const {
    mutationKey,
    endpoint,
    submitLabel,
    submitIcon: SubmitIconComponent,
    confirmationMessage,
    ...mutationOptions
  } = getMutationConfig(resource, defaultValues, relationContext);

  const metadata = getResourceMetadata(resource);
  const declensions = declineNoun(resource);

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
      router.push(
        // assume that creatable resources in non-embedded forms are routable/editable
        metadata.isSingleton === true
          ? `/${resource as RoutableResource}`
          : `/${resource as EditableResource}/edit/${sanitizeId(response.data.id)}`,
      );
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

  const onSubmit = form.handleSubmit((values) =>
    toast.promise(
      mutateAsync(values),
      getToastMessages.resource(resource).modify,
    ),
  );

  return (
    <ArfSheetProvider
      resource={resource}
      className={cn("mx-auto flex h-full flex-col", className)}
    >
      <Form {...form}>
        <form className="flex grow flex-col gap-4" onSubmit={onSubmit}>
          <ArfBody
            resource={resource}
            control={form.control}
            defaultValues={defaultValues}
            existingImages={existingImages}
            relatedResources={relatedResources}
            pivotResources={pivotResources}
          />
          <footer
            className={cn(
              "flex w-full flex-col flex-wrap items-center gap-x-4 gap-y-2",
              isEmbedded
                ? "flex-col items-stretch gap-y-4"
                : "lg:flex-row-reverse",
            )}
          >
            <ArfConfirmationModal
              loading={isPending}
              disabled={!isFormStateDirty(form.formState)}
              form={form}
              onSubmit={onSubmit}
              confirmationMessage={confirmationMessage}
            >
              {submitLabel} {declensions.accusative} <SubmitIconComponent />
            </ArfConfirmationModal>
            {isEditing && metadata.deletable !== false ? (
              <DeleteButtonWithDialog
                resource={resource}
                id={get(defaultValues, getResourcePk(resource)) as ResourcePk}
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
                        // again, assume that only routable resources use non-embedded forms
                        router.push(`/${resource as RoutableResource}`);
                        return false;
                      },
                    })}
              />
            ) : null}

            {isEmbedded ? null : (
              // It would be too complex to relate `isEmbedded` to `resource` being a `RoutableResource`,
              // so I'm going to assume the codebase won't use `AbstractResourceForm` anywhere except for
              // routable resources with `isEmbedded` set to `false` and otherwise with it set to `true`.
              <ReturnButton
                className="lg:mr-auto"
                resource={resource as RoutableResource}
                returnLabel="Wróć do"
                icon={ChevronLeft}
              />
            )}
          </footer>
        </form>
      </Form>
    </ArfSheetProvider>
  );
}
