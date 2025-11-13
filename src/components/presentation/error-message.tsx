import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { ApplicationError } from "@/config/enums";
import { APPLICATION_ERROR_MESSAGES } from "@/data/application-error-messages";
import type { RoutableResource } from "@/features/resources/types";
import type { LayoutProps } from "@/types/components";

import { BackToHomeButton } from "./back-to-home-button";
import { ReturnButton } from "./return-button";
import { UserInfo } from "./user-info";

function ErrorContextInfo({ children }: LayoutProps) {
  return (
    <div className="text-muted-foreground order-3 text-center">{children}</div>
  );
}

const ERROR_CONTEXT_INFOS: Partial<Record<ApplicationError, ReactNode>> = {
  [ApplicationError.Forbidden]: (
    <ErrorContextInfo>
      <UserInfo />
    </ErrorContextInfo>
  ),
  [ApplicationError.ServerError]: (
    <Badge variant="destructive" className="order-3">
      Proszę zgłosić ten błąd twórcom w KN Solvro.
    </Badge>
  ),
  [ApplicationError.NotImplemented]: (
    <h3 className="text-foreground order-1 text-3xl font-semibold">
      Strona w budowie
    </h3>
  ),
};

export function ErrorMessage({
  type,
  message,
  returnToResource,
}: {
  type: ApplicationError;
  message?: ReactNode;
  returnToResource?: RoutableResource;
}) {
  const contextInfo = ERROR_CONTEXT_INFOS[type];

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="order-1 -mt-18 text-5xl font-semibold">{type}</h2>
        <p className="order-2 text-center text-balance">
          {message ?? APPLICATION_ERROR_MESSAGES[type]}
        </p>
        {contextInfo ?? null}
        <div className="order-4">
          {returnToResource == null ? (
            <BackToHomeButton />
          ) : (
            <ReturnButton resource={returnToResource} />
          )}
        </div>
      </div>
    </div>
  );
}
