"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import type { Route } from "next";
import { get, useForm } from "react-hook-form";
import type { DefaultValues, Resolver } from "react-hook-form";
import { toast } from "sonner";

import { ReturnButton } from "@/components/presentation/return-button";
import { Form } from "@/components/ui/form";
import {
  canApproveDrafts,
  canManageAllDrafts,
  canSuggestNewResource,
  canSuggestResourceEdit,
  mustUseDrafts,
  useCurrentUser,
} from "@/features/authentication";
import {
  fetchMutation,
  getErrorMessage,
  useMutationWrapper,
} from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import {
  DeleteButtonWithDialog,
  RESOURCE_SCHEMAS,
  getResourceMetadata,
  getResourcePk,
  getResourcePkValue,
} from "@/features/resources";
import type {
  EditableResource,
  ResourceDataWithRelations,
  ResourceDefaultValues,
  ResourceFormValues,
  ResourcePivotRelationData,
  ResourcePk,
  RoutableResource,
} from "@/features/resources/types";
import {
  ApproveButton,
  DraftNotice,
  getDraftEditRoute,
  getDraftListRoute,
} from "@/features/review";
import type { DraftNoticeVariant, DraftableResource } from "@/features/review";
import { useRouter } from "@/hooks/use-router";
import { getToastMessages } from "@/lib/get-toast-messages";
import { cn } from "@/lib/utils";
import type {
  ExistingImages,
  ResourceFormProps,
  ResourceRelations,
} from "@/types/components";

import { useArfRelation } from "../hooks/use-arf-relation";
import { useFormWithPersistence } from "../hooks/use-form-with-persistence";
import { ArfSheetProvider } from "../providers/arf-sheet-provider";
import { generateFormStorageKey } from "../utils/generate-form-storage-key";
import { getDefaultValues } from "../utils/get-default-values";
import { getMutationConfig } from "../utils/get-mutation-config";
import { isExistingItem } from "../utils/is-existing-item";
import { isFormStateDirty } from "../utils/is-form-state-dirty";
import { ArfBody } from "./arf-body";
import { ArfCancelButton } from "./arf-cancel-button";
import { ArfConfirmationModal } from "./arf-confirmation-modal";
import { ArfResetButton } from "./arf-reset-button";

const EXCLUDED_FIELDS = ["id"];

/** Controller component for Abstract Resource Form. Sets up form context and handles submission. */
export function ArfController<T extends Resource>({
  resource,
  defaultValues,
  existingImages,
  relatedResources,
  pivotResources,
  className,
  draft = false,
  existingDraftHref,
}: ResourceFormProps<T> & {
  defaultValues: ResourceDefaultValues<T>;
  existingImages: ExistingImages<T>;
  relatedResources: ResourceRelations<T>;
  pivotResources: ResourcePivotRelationData<T>;
}) {
  const schema = RESOURCE_SCHEMAS[resource];
  const router = useRouter();
  const relationContext = useArfRelation();
  const user = useCurrentUser();
  const form = useForm<ResourceFormValues<T>>({
    // Maybe try extracting the id from the defaultValues and passing it as an editedResourceId prop
    resolver: zodResolver(schema) as Resolver<ResourceFormValues<T>>,
    defaultValues: getDefaultValues(
      defaultValues,
      relationContext,
    ) as DefaultValues<ResourceFormValues<T>>,
  });

  const isEditing = isExistingItem(resource, defaultValues);
  const isEmbedded = relationContext != null;

  const storageKey = generateFormStorageKey(
    resource,
    defaultValues as ResourceDataWithRelations<T>,
    isEditing,
    isEmbedded,
  );

  const { clearPersistedData, resetForm } = useFormWithPersistence({
    storageKey,
    form,
    excludedFields: EXCLUDED_FIELDS,
    isEditing,
  });

  const {
    mutationKey: configMutationKey,
    endpoint: configEndpoint,
    method: configMethod,
    submitLabel: configSubmitLabel,
    submitIcon: SubmitIconComponent,
    confirmationMessage,
    onAfterCreate,
    ...restOptions
  } = getMutationConfig(resource, defaultValues, relationContext);

  const metadata = getResourceMetadata(resource);
  const declensions = declineNoun(resource);

  const isDraftMode =
    draft || (mustUseDrafts(user) && metadata.apiDraftPath != null);
  const shouldCreateDraftFromExisting = isDraftMode && isEditing && !draft;
  const isSuggestingNew = isDraftMode && !isEditing && !draft;
  const originalId = get(defaultValues, "originalId") as
    | number
    | null
    | undefined;
  const draftListRoute = getDraftListRoute(canManageAllDrafts(user));

  const noticeVariant: DraftNoticeVariant | null = draft
    ? "editing-draft"
    : shouldCreateDraftFromExisting
      ? canSuggestResourceEdit(
          user,
          resource,
          getResourcePkValue(resource, defaultValues),
        )
        ? "suggesting-edit"
        : "forbidden"
      : isSuggestingNew
        ? canSuggestNewResource(user, resource)
          ? "suggesting-new"
          : "forbidden"
        : null;
  const canSubmit = noticeVariant !== "forbidden";

  const mutationKey = shouldCreateDraftFromExisting
    ? `create__${resource}__draft`
    : configMutationKey;
  const endpoint = shouldCreateDraftFromExisting ? "/" : configEndpoint;
  const method = shouldCreateDraftFromExisting ? "POST" : configMethod;
  const submitLabel = draft
    ? "Zapisz draft"
    : shouldCreateDraftFromExisting
      ? "Zaproponuj zmiany"
      : isSuggestingNew
        ? `Zaproponuj ${declensions.accusative}`
        : `${configSubmitLabel} ${declensions.accusative}`;
  const toastMessages = isDraftMode
    ? {
        loading: "Trwa zapisywanie draftu...",
        success: shouldCreateDraftFromExisting
          ? "Propozycja zmian została zapisana jako draft!"
          : "Pomyślnie zapisano draft!",
        error: (error: unknown) =>
          getErrorMessage(error, "Wystąpił błąd podczas zapisywania draftu."),
      }
    : getToastMessages.resource(resource).modify;

  const { mutateAsync, isPending } = useMutationWrapper<
    ModifyResourceResponse<T>,
    ResourceFormValues<T>
  >(mutationKey, async (body) => {
    const response = await fetchMutation<ModifyResourceResponse<T>>(endpoint, {
      body: shouldCreateDraftFromExisting
        ? { ...body, originalId: getResourcePkValue(resource, defaultValues) }
        : body,
      resource,
      draft: isDraftMode,
      method,
      ...restOptions,
    });
    const wasCreated = method === "POST";

    // initially disables the save button after successful edit
    form.reset(wasCreated ? undefined : response.data);

    clearPersistedData();

    if (wasCreated && onAfterCreate != null) {
      await onAfterCreate(response.data);
    }

    const newPrimaryKey = getResourcePkValue(resource, response.data);
    const primaryKeyChanged =
      isEditing &&
      newPrimaryKey !== getResourcePkValue(resource, defaultValues);
    if (relationContext == null && wasCreated) {
      if (isDraftMode) {
        router.push(
          getDraftEditRoute(resource as DraftableResource, newPrimaryKey),
        );
      } else {
        router.push(
          // assume that creatable resources in non-embedded forms are routable/editable
          metadata.isSingleton === true
            ? `/${resource as RoutableResource}`
            : `/${resource as EditableResource}/edit/${newPrimaryKey}`,
        );
      }
    } else if (relationContext == null && primaryKeyChanged) {
      // cast is safe as the resource has to be editable in order for the pk to change
      router.replace(`/${resource as EditableResource}/edit/${newPrimaryKey}`);
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
    toast.promise(mutateAsync(values), toastMessages),
  );

  return (
    <ArfSheetProvider
      resource={resource}
      className={cn("mx-auto flex h-full flex-col", className)}
    >
      <Form {...form}>
        <form className="flex grow flex-col gap-4" onSubmit={onSubmit}>
          {noticeVariant == null || isEmbedded ? null : (
            <DraftNotice
              resource={resource}
              variant={noticeVariant}
              originalHref={
                draft && originalId != null
                  ? (`/${resource as EditableResource}/edit/${String(originalId)}` as Route)
                  : undefined
              }
              existingDraftHref={existingDraftHref}
            />
          )}
          <div className="grow basis-0 overflow-y-auto">
            <div
              className={cn(
                "bg-accent text-accent-foreground flex min-h-full flex-col gap-4 rounded-xl p-4",
                { "md:flex-row": !isEmbedded },
              )}
            >
              <ArfBody
                resource={resource}
                control={form.control}
                defaultValues={defaultValues}
                existingImages={existingImages}
                relatedResources={relatedResources}
                pivotResources={pivotResources}
                isDraft={isDraftMode}
              />
            </div>
          </div>
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
              disabled={!canSubmit || !isFormStateDirty(form.formState)}
              form={form}
              onSubmit={onSubmit}
              confirmationMessage={confirmationMessage}
            >
              {submitLabel}
              <SubmitIconComponent />
            </ArfConfirmationModal>
            {draft && canApproveDrafts(user) ? (
              <ApproveButton
                id={get(defaultValues, getResourcePk(resource)) as ResourcePk}
                resource={resource}
                disabled={isFormStateDirty(form.formState)}
                showLabel
              />
            ) : null}
            {isEditing &&
            !shouldCreateDraftFromExisting &&
            metadata.deletable !== false ? (
              <DeleteButtonWithDialog
                resource={resource}
                id={get(defaultValues, getResourcePk(resource)) as ResourcePk}
                showLabel
                size="default"
                isDraft={draft}
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
                        router.push(
                          draft
                            ? draftListRoute
                            : `/${resource as RoutableResource}`,
                        );
                        return false;
                      },
                    })}
              />
            ) : null}

            {isEditing ? (
              isEmbedded ? null : (
                <ArfResetButton
                  onResetForm={resetForm}
                  disabled={!isFormStateDirty(form.formState)}
                />
              )
            ) : (
              <ArfCancelButton
                resource={resource as RoutableResource}
                disabled={!isFormStateDirty(form.formState)}
                onClearData={() => {
                  clearPersistedData();
                  relationContext?.closeSheet();
                }}
                navigateOnClearData={!isEmbedded}
              />
            )}
            {isEmbedded ? null : (
              <>
                {/* It would be too complex to relate `isEmbedded` to `resource` being a `RoutableResource`,
                    so I'm going to assume the codebase won't use `AbstractResourceForm` anywhere except for
                    routable resources with `isEmbedded` set to `false` and otherwise with it set to `true`. */}
                {draft ? (
                  <ReturnButton
                    className="lg:mr-auto"
                    href={draftListRoute}
                    target="draftów"
                    returnLabel="Wróć do"
                    icon={ChevronLeft}
                  />
                ) : (
                  <ReturnButton
                    className="lg:mr-auto"
                    resource={resource as RoutableResource}
                    returnLabel="Wróć do"
                    icon={ChevronLeft}
                  />
                )}
              </>
            )}
          </footer>
        </form>
      </Form>
    </ArfSheetProvider>
  );
}
