import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { APPLICATION_ERROR_MESSAGES } from "@/config/constants";
import { ApplicationError, DeclensionCase } from "@/config/enums";
import { declineNoun } from "@/lib/polish";
import type { RoutableResource } from "@/types/app";
import type { LayoutProps } from "@/types/components";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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

  const [returnHref, returnTarget] =
    returnToResource == null
      ? (["/", "strony głównej"] as const)
      : ([
          `/${returnToResource}`,
          declineNoun(returnToResource, {
            case: DeclensionCase.Genitive,
            plural: true,
          }),
        ] as const);

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
        <Button variant="link" asChild>
          <Link
            href={returnHref}
            className="group text-foreground mt-2 text-sm"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-120"
            />
            Powrót do {returnTarget}
          </Link>
        </Button>
      </div>
    </div>
  );
}
