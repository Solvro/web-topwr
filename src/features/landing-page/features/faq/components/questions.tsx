import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FAQ_QUESTIONS } from "../constants";

export function Questions() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={FAQ_QUESTIONS[0].question}
      className="flex w-full flex-col gap-3"
    >
      {FAQ_QUESTIONS.map(({ question, answer }, index) => (
        <AccordionItem
          key={question}
          value={question}
          className="border-border bg-card rounded-2xl border px-5 last:border-b"
        >
          <AccordionTrigger className="items-center py-5 text-lg font-semibold tracking-tight hover:no-underline md:text-xl">
            <span className="flex items-baseline gap-3">
              <span
                aria-hidden
                className="text-primary w-6 shrink-0 font-mono text-sm"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-5 pl-9">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
