import type { ReactNode } from "react";

import { APPLICATION_ERROR_MESSAGES } from "@/config/constants";
import { ApplicationError } from "@/config/enums";
import type { RoutableResource } from "@/types/app";
import type { LayoutProps } from "@/types/components";

import { BackToHomeButton } from "./abstract/back-to-home-button";
import { ReturnButton } from "./return-button";
import { Badge } from "./ui/badge";
import { UserInfo } from "./user-info";

function ErrorContextInfo({ children }: LayoutProps) {
  return (
    <div className="text-muted-foreground mt-2 text-center">{children}</div>
  );
}

const ERROR_CONTEXT_INFOS: Partial<Record<ApplicationError, ReactNode>> = {
  [ApplicationError.Forbidden]: <UserInfo />,
  [ApplicationError.ServerError]: (
    <Badge variant="destructive">
      Proszę zgłosić ten błąd twórcom w KN Solvro.
    </Badge>
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
      <div className="flex flex-col justify-center">
        <h2 className="-mt-18 text-center text-5xl font-semibold">{type}</h2>
        <p className="mt-2 text-center">
          {message ?? APPLICATION_ERROR_MESSAGES[type]}
        </p>
        {contextInfo == null ? null : (
          <ErrorContextInfo>{contextInfo}</ErrorContextInfo>
        )}
        {returnToResource == null ? (
          <BackToHomeButton />
        ) : (
          <ReturnButton resource={returnToResource} />
        )}
      </div>
    </div>
  );
}
