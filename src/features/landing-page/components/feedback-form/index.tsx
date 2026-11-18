"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FeedbackFormAside } from "./feedback-form-aside";
import { FeedbackFormFields } from "./feedback-form-fields";
import {
  
  feedbackFormSchema
} from "./feedback-form-schema";
import type {FeedbackFormValues} from "./feedback-form-schema";
import { FeedbackFormSuccess } from "./feedback-form-success";

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      email: "",
      category: undefined,
      message: "",
    },
    mode: "onChange",
  });

  function handleSubmit() {
    setSubmitted(true);
  }

  function handleBackToForm() {
    form.reset();
    setSubmitted(false);
  }

  return (
    <section className="bg-background relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
      <div className="border-border/60 bg-background grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border shadow-sm md:grid-cols-[350px_minmax(0,1fr)]">
        <FeedbackFormAside />

        <div className="flex h-[480px] w-full flex-col justify-center px-5 py-6 sm:px-7 md:px-8 md:py-8">
          {submitted ? (
            <FeedbackFormSuccess onBackToForm={handleBackToForm} />
          ) : (
            <FeedbackFormFields form={form} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </section>
  );
}
