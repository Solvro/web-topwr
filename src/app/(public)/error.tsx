"use client";

import { ErrorMessage } from "@/components/error-message";
import { ApplicationError } from "@/config/enums";

export default function ErrorPage() {
  return <ErrorMessage type={ApplicationError.ServerError} />;
}
