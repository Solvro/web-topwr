"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { get, useForm } from "react-hook-form";
import type { DefaultValues, Resolver } from "react-hook-form";
import { toast } from "sonner";

import { DeleteButtonWithDialog } from "@/components/abstract/delete-button-with-dialog";
import { Link } from "@/components/link";
import { ArfSheetProvider } from "@/components/providers/arf-sheet-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useArfRelation } from "@/hooks/use-arf-relation";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { useRouter } from "@/hooks/use-router";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
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
  EditableResource,
  Id,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourcePivotRelationData,
  RoutableResource,
} from "@/types/app";
import type {
  ExistingImages,
  ResourceFormProps,
  ResourceRelations,
} from "@/types/components";

import { ArfInputs } from "./inputs";

export function AbstractResourceFormClient<T extends Resource>({
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

  const isEditing = isExistingResourceItem(resource, defaultValues);
  const isEmbedded = relationContext != null;
  const { subscribe } = form;

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { isDirty: true },
      callback: ({ isDirty }) => {
        setHasUnsavedChanges(isDirty ?? false);
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
      router.push(
        // assume that creatable resources in non-embedded forms are editable
        `/${resource as EditableResource}/edit/${sanitizeId(response.data.id)}`,
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

  const declensions = declineNoun(resource);
  const metadata = getResourceMetadata(resource);

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
          <ArfInputs
            resource={resource}
            control={form.control}
            defaultValues={defaultValues}
            existingImages={existingImages}
            relatedResources={relatedResources}
            pivotResources={pivotResources}
          />
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
                        // again, assume that only routable resources use non-embedded forms
                        router.push(`/${resource as RoutableResource}`);
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
