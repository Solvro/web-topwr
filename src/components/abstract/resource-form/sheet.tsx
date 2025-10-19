"use client";

import { Save } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

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
}: {
  resource: T;
  content: ResourceFormSheetDataContent<T>;
}) {
  const contentResource = content.resource as Resource;
  const relationDeclensions = declineNoun(contentResource);

  const [sheetTitle, sheetDescription] =
    content.type === "create"
      ? [
          `Utwórz ${relationDeclensions.accusative}`,
          `Stwórz ${declineNoun(contentResource, {
            prependDeterminer: "new",
            case: DeclensionCase.Nominative,
          })} dla ${declineNoun(resource, { case: DeclensionCase.Genitive, plural: true })}.`,
        ]
      : [
          `Edycja ${relationDeclensions.genitive}`,
          `Zmień dane ${declineNoun(contentResource, {
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
      <SheetFooter>
        <Button>
          Zapisz <Save />
        </Button>
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
  return (
    <Sheet
      open={sheet.visible}
      onOpenChange={(open) => {
        if (!open) {
          setSheet((oldValue) => ({ ...oldValue, visible: false }));
        }
      }}
    >
      {sheet.content == null ? null : (
        <AbstractResourceFormSheetContent
          resource={resource}
          content={sheet.content}
        />
      )}
    </Sheet>
  );
}
