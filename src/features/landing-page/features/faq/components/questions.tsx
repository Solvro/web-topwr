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
      {FAQ_QUESTION_IDS.map((questionId) => (
        <AccordionItem
          key={questionId}
          value={questionId}
          className="border-border bg-card rounded-2xl border px-5 last:border-b"
        >
          <AccordionTrigger className="items-center py-5 text-lg font-semibold tracking-tight hover:no-underline md:text-xl">
            {t(`${questionId}.question`)}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-5">
            {t(`${questionId}.answer`)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
