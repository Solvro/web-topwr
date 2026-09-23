import { FilePen, Info, ShieldAlert } from "lucide-react";
import type { Route } from "next";

import { Link } from "@/components/core/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";

export type DraftNoticeVariant =
  | "editing-draft"
  | "suggesting-edit"
  | "suggesting-new"
  | "forbidden";

export function DraftNotice({
  resource,
  variant,
  originalHref,
  existingDraftHref,
}: {
  resource: Resource;
  variant: DraftNoticeVariant;
  /** Link to the resource instance the edited draft proposes changes to. */
  originalHref?: Route;
  existingDraftHref?: Route;
}) {
  const declensions = declineNoun(resource);
  const Icon =
    variant === "forbidden"
      ? ShieldAlert
      : variant === "editing-draft"
        ? FilePen
        : Info;

  const message = {
    "editing-draft": (
      <>
        Edytujesz draft {declensions.genitive}. Zmiany zostaną opublikowane
        dopiero po jego zatwierdzeniu.
        {originalHref == null ? null : (
          <>
            {" "}
            <Link href={originalHref} className="font-medium">
              Zobacz aktualną wersję
            </Link>
          </>
        )}
      </>
    ),
    "suggesting-edit": (
      <>
        Zmiany nie zostaną opublikowane od razu - zostaną zapisane jako draft i
        przekazane do zatwierdzenia.
        {existingDraftHref == null ? null : (
          <>
            {" "}
            Masz już draft z propozycją zmian w tym obiekcie -{" "}
            <Link href={existingDraftHref} className="font-medium">
              przejdź do draftu
            </Link>
            .
          </>
        )}
      </>
    ),
    "suggesting-new": (
      <>
        Twoja propozycja zostanie zapisana jako draft i opublikowana dopiero po
        zatwierdzeniu.
      </>
    ),
    forbidden: (
      <>
        Nie masz uprawnień do proponowania zmian w tym miejscu. Skontaktuj się z
        administratorem, jeśli uważasz, że to błąd.
      </>
    ),
  }[variant];

  return (
    <Alert
      role="status"
      variant={variant === "forbidden" ? "destructive" : "primary"}
    >
      <Icon />
      <AlertDescription>
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  );
}
