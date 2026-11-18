import { ArrowRight } from "lucide-react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  
  feedbackCategories
} from "./feedback-form-schema";
import type {FeedbackFormValues} from "./feedback-form-schema";

interface FeedbackFormFieldsProps {
  form: UseFormReturn<FeedbackFormValues>;
  onSubmit: SubmitHandler<FeedbackFormValues>;
}

export function FeedbackFormFields({
  form,
  onSubmit,
}: FeedbackFormFieldsProps) {
  return (
    <>
      <h2 className="text-foreground text-3xl leading-tight font-normal sm:text-4xl">
        Feedback
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Masz uwagi lub pomysł? Daj nam znać.
      </p>

      <Form {...form}>
        <form
          className="mt-5 space-y-3"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="text-xs">
                  Adres e-mail (Opcjonalnie)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="np. jan.kowalski@student.pwr.edu.pl"
                    autoComplete="email"
                    className="border-border bg-background placeholder:text-muted-foreground/80 h-9 rounded-md px-3 text-sm"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Podaj e-mail, jeśli chcesz otrzymać odpowiedź
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="text-xs">Kategoria zgłoszenia</FormLabel>
                <div
                  aria-label="Kategoria zgłoszenia"
                  className="flex flex-wrap gap-1.5"
                  role="radiogroup"
                >
                  {feedbackCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      role="radio"
                      aria-checked={field.value === category}
                      onClick={() => { field.onChange(category); }}
                      className={`focus-visible:ring-primary cursor-pointer rounded-lg px-3 py-1.5 text-[11px] leading-none text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        field.value === category
                          ? "bg-gradient-1"
                          : "bg-gradient-1/50 hover:bg-gradient-1/75"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="text-xs">Wiadomość</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Napisz, co chcesz nam przekazać..."
                    className="border-border bg-background placeholder:text-muted-foreground/80 field-sizing-fixed h-24 resize-none overflow-y-auto rounded-md px-3 py-2 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="shadow-primary/20 h-10 rounded-full px-5 text-sm shadow-lg"
          >
            Wyślij feedback
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>
      </Form>
    </>
  );
}
