"use client";

import { Suspense } from "react";
import type { Dispatch, SetStateAction } from "react";
import { get } from "react-hook-form";

import { DeleteButtonWithDialog } from "@/components/delete-button-with-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { ArfContext } from "@/hooks/use-abstract-resource-form";
import type { RelationContext } from "@/hooks/use-abstract-resource-form";
import { getResourcePk } from "@/lib/helpers/app";
import { declineNoun } from "@/lib/polish";
import type {
  ResourceFormSheetData,
  ResourceFormSheetDataContent,
} from "@/types/components";

import { AbstractResourceFormSkeleton } from "./skeleton";

function AbstractResourceFormSheetContent<T extends Resource>({
  resource,
  content,
  closeSheet,
}: {
  resource: T;
  content: ResourceFormSheetDataContent<T>;
  closeSheet: () => void;
}) {
  const relatedResource = content.childResource as Resource;
  const relationDeclensions = declineNoun(relatedResource);
  const resourceDeclensions = declineNoun(resource);

  const [sheetTitle, sheetDescription] =
    content.item == null
      ? [
          `Utwórz ${relationDeclensions.accusative}`,
          `Stwórz ${declineNoun(relatedResource, {
            prependDeterminer: "new",
            case: DeclensionCase.Accusative,
          })} dla ${resourceDeclensions.genitive}.`,
        ]
      : [
          `Edycja ${relationDeclensions.genitive}`,
          `Zmień dane ${declineNoun(relatedResource, {
            prependDeterminer: "existing",
            case: DeclensionCase.Genitive,
          })} ${resourceDeclensions.dative}.`,
        ];

  const parentResourceId = get(
    content.parentResourceData,
    getResourcePk(resource),
  ) as string | number | null;
  if (
    parentResourceId == null ||
    !["string", "number"].includes(typeof parentResourceId)
  ) {
    throw new Error("Parent resource ID is missing or invalid.");
  }

  const relationContext: RelationContext<T> = {
    parentResource: resource,
    parentResourceId,
    childResource: content.childResource,
    closeSheet,
  };

  return (
    <SheetContent className="lg:min-w-1/3">
      <SheetHeader>
        <SheetTitle>{sheetTitle}</SheetTitle>
        <SheetDescription>{sheetDescription}</SheetDescription>
      </SheetHeader>
      <ArfContext.Provider
        value={{
          relationContext,
        }}
      >
        <Suspense fallback={<AbstractResourceFormSkeleton />}>
          {content.form}
        </Suspense>
      </ArfContext.Provider>
      <SheetFooter className="pt-0">
        {content.item == null ? null : (
          <DeleteButtonWithDialog
            resource={relatedResource}
            showLabel
            variant="destructive"
            size="lg"
            onDeleteSuccess={async () => {
              closeSheet();
              // Give time for the sheet to close before resolving the deletion (triggers refresh)
              await new Promise((resolve) => setTimeout(resolve, 300));
            }}
            itemName={content.item.name}
            {...content.item}
          />
        )}
        <SheetClose asChild>
          <Button variant="outline">Zamknij</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

export function AbstractResourceFormSheet<T extends Resource>({
  resource,
  sheet,
  setSheet,
}: {
  resource: T;
  sheet: ResourceFormSheetData<T>;
  setSheet: Dispatch<SetStateAction<ResourceFormSheetData<T>>>;
}) {
  const closeSheet = () => {
    setSheet((oldValue) => ({ ...oldValue, visible: false }));
  };
  return (
    <Sheet
      open={sheet.visible}
      onOpenChange={(open) => {
        if (!open && sheet.visible) {
          closeSheet();
        }
      }}
    >
      {sheet.content == null ? null : (
        <AbstractResourceFormSheetContent
          resource={resource}
          content={sheet.content}
          closeSheet={closeSheet}
        />
      )}
    </Sheet>
  );
}
