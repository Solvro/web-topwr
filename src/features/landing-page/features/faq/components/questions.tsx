import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FAQ_QUESTION_IDS } from "../constants";

export function Questions() {
  const t = useTranslations("Faq.questions");

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={FAQ_QUESTION_IDS[0]}
      className="flex w-full flex-col gap-3"
    >
      {FAQ_QUESTION_IDS.map((questionId, index) => (
        <AccordionItem
          key={questionId}
          value={questionId}
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
              {t(`${questionId}.question`)}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-5 pl-9">
            {t(`${questionId}.answer`)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
