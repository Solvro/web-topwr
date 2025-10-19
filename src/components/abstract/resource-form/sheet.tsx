"use client";

import type { Dispatch, SetStateAction } from "react";

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
import { declineNoun } from "@/lib/polish";
import type {
  ResourceFormSheetData,
  ResourceFormSheetDataContent,
} from "@/types/app";

function AbstractResourceFormSheetContent<T extends Resource>({
  resource,
  content,
  closeSheet,
}: {
  resource: T;
  content: ResourceFormSheetDataContent<T>;
  closeSheet: () => void;
}) {
  const relatedResource = content.resource as Resource;
  const relationDeclensions = declineNoun(relatedResource);

  const [sheetTitle, sheetDescription] =
    content.item == null
      ? [
          `Utwórz ${relationDeclensions.accusative}`,
          `Stwórz ${declineNoun(relatedResource, {
            prependDeterminer: "new",
            case: DeclensionCase.Nominative,
          })} dla ${declineNoun(resource, { case: DeclensionCase.Genitive, plural: true })}.`,
        ]
      : [
          `Edycja ${relationDeclensions.genitive}`,
          `Zmień dane ${declineNoun(relatedResource, {
            prependDeterminer: "existing",
            case: DeclensionCase.Genitive,
          })} ${declineNoun(resource, { case: DeclensionCase.Dative })}.`,
        ];

  return (
    <SheetContent className="lg:min-w-1/3">
      <SheetHeader>
        <SheetTitle>{sheetTitle}</SheetTitle>
        <SheetDescription>{sheetDescription}</SheetDescription>
      </SheetHeader>
      {content.form}
      <SheetFooter className="pt-0">
        {content.item == null ? null : (
          <DeleteButtonWithDialog
            resource={relatedResource}
            showLabel
            variant="destructive"
            size="lg"
            onDeleteSuccess={closeSheet}
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
        if (!open) {
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
