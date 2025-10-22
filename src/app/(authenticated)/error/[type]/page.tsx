import { notFound } from "next/navigation";

import { ErrorMessage } from "@/components/error-message";
import { ApplicationError } from "@/config/enums";

const isApplicationError = (error: number): error is ApplicationError =>
  (ApplicationError[error] as string | null) != null;

export default async function ErrorPage({
  params,
}: PageProps<"/error/[type]">) {
  const { type } = await params;

  const typeNumber = Number(type);
  if (Number.isNaN(typeNumber) || !isApplicationError(typeNumber)) {
    notFound();
  }

  return <ErrorMessage type={typeNumber} />;
}
