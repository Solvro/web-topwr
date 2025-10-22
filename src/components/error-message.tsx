import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { APPLICATION_ERROR_MESSAGES } from "@/config/constants";
import { ApplicationError } from "@/config/enums";
import type { LayoutProps } from "@/types/components";

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

export function ErrorMessage({ type }: { type: ApplicationError }) {
  const message = APPLICATION_ERROR_MESSAGES[type];

  const contextInfo = ERROR_CONTEXT_INFOS[type];

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col justify-center">
        <h2 className="-mt-18 text-center text-5xl font-semibold">{type}</h2>
        <p className="mt-2 text-center">{message}</p>
        {contextInfo == null ? null : (
          <ErrorContextInfo>{contextInfo}</ErrorContextInfo>
        )}
        <Link
          href="/"
          className="group mt-8 flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-120"
          />
          <span className="border-b border-transparent transition-colors duration-300 group-hover:border-current">
            Powrót do strony głównej
          </span>
        </Link>
      </div>
    </div>
  );
}
