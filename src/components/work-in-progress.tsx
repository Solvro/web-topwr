import { DeclensionCase } from "@/config/enums";
import { declineNoun } from "@/lib/polish";
import type { RoutableResource } from "@/types/app";

import { ReturnButton } from "./return-button";

export function WorkInProgress({ resource }: { resource: RoutableResource }) {
  const returnTarget = declineNoun(resource, {
    case: DeclensionCase.Genitive,
    plural: true,
  });
  return (
    <div className="grid size-full place-items-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold">Strona w budowie</h2>
        <p>Ta strona jest w trakcie tworzenia. Wróć później!</p>
        <ReturnButton target={returnTarget} href={`/${resource}`} />
      </div>
    </div>
  );
}
