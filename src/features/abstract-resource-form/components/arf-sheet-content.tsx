import { Suspense } from "react";
import { get } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import { getResourcePk } from "@/features/resources";
import { tryParseNumber } from "@/utils";

import { ArfRelationContext } from "../context/arf-relation-context";
import type {
  ArfRelationContextType,
  ArfSheetDataContent,
} from "../types/internal";
import { ArfSkeleton } from "./arf-skeleton";

export function ArfSheetContent<T extends Resource>({
  resource,
  content,
  closeSheet,
}: {
  resource: T;
  content: ArfSheetDataContent<T>;
  closeSheet: () => void;
}) {
  const relationDeclensions = declineNoun(content.childResource);
  const resourceDeclensions = declineNoun(resource);

  const [sheetTitle, sheetDescription] =
    content.item == null
      ? [
          `Utwórz ${relationDeclensions.accusative}`,
          `Stwórz ${declineNoun(content.childResource, {
            prependDeterminer: "new",
            case: GrammaticalCase.Accusative,
          })} dla ${resourceDeclensions.genitive}.`,
        ]
      : [
          `Edycja ${relationDeclensions.genitive}`,
          `Zmień dane ${declineNoun(content.childResource, {
            prependDeterminer: "existing",
            case: GrammaticalCase.Genitive,
          })} ${resourceDeclensions.genitive}.`,
        ];

  const parentResourceId = get(
    content.parentResourceData,
    getResourcePk(resource),
  ) as string | null;
  if (
    parentResourceId == null ||
    !["string", "number"].includes(typeof parentResourceId)
  ) {
    throw new Error("Parent resource ID is missing or invalid.");
  }

  const relationContext: ArfRelationContextType<T> = {
    parentResource: resource,
    parentResourceId: tryParseNumber(parentResourceId),
    childResource: content.childResource,
    closeSheet,
  };

  return (
    <SheetContent className="lg:min-w-1/3">
      <SheetHeader>
        <SheetTitle>{sheetTitle}</SheetTitle>
        <SheetDescription>{sheetDescription}</SheetDescription>
      </SheetHeader>
      <ArfRelationContext.Provider value={relationContext}>
        <Suspense
          fallback={<ArfSkeleton showDeleteButton={content.item != null} />}
        >
          {content.form}
        </Suspense>
      </ArfRelationContext.Provider>
      <SheetFooter className="pt-0">
        <SheetClose asChild>
          <Button variant="outline">Zamknij</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
