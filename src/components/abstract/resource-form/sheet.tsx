"use client";

import { Save } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
  ResourceRelation,
} from "@/types/app";

function AbstractResourceFormSheetContent<T extends Resource>({
  resource,
  content,
}: {
  resource: T;
  content: ResourceFormSheetDataContent<ResourceRelation<T>>;
}) {
  const genericRelatedResource = content.resource as Resource;
  const relationDeclensions = declineNoun(genericRelatedResource);
  const [sheetTitle, sheetDescription] =
    content.item == null
      ? [
          `Utwórz ${relationDeclensions.accusative}`,
          `Stwórz ${declineNoun(genericRelatedResource, {
            prependDeterminer: "new",
            case: DeclensionCase.Nominative,
          })} dla ${declineNoun(resource, { case: DeclensionCase.Genitive, plural: true })}.`,
        ]
      : [
          `Edycja ${relationDeclensions.genitive}`,
          `Zmień dane ${declineNoun(genericRelatedResource, {
            prependDeterminer: "existing",
            case: DeclensionCase.Genitive,
          })} ${declineNoun(resource, { case: DeclensionCase.Dative })}.`,
        ];

  const form = useForm({
    defaultValues: content.item ?? {},
  });

  return (
    <SheetContent className="lg:min-w-1/3">
      <SheetHeader>
        <SheetTitle>{sheetTitle}</SheetTitle>
        <SheetDescription>{sheetDescription}</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className="px-4">This is the content</form>
      </Form>
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
  sheet: ResourceFormSheetData<ResourceRelation<T>>;
  setSheet: Dispatch<
    SetStateAction<ResourceFormSheetData<ResourceRelation<T>>>
  >;
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
