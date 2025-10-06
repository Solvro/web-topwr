import { notFound } from "next/navigation";

import { ErrorMessage } from "@/components/error-message";
import { ERROR_CODES } from "@/config/constants";
import type { ErrorCode } from "@/types/app";

const isErrorCode = (code: string | number): code is ErrorCode =>
  (ERROR_CODES[code as ErrorCode] as string | null) != null;

export default async function ErrorPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!isErrorCode(code)) {
    notFound();
  }

  return <ErrorMessage code={code} />;
}
