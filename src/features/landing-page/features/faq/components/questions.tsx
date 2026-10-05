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
      className="w-full"
    >
      {FAQ_QUESTIONS.map(({ question, answer }) => (
        <AccordionItem key={question} value={question}>
          <AccordionTrigger className="text-xl font-bold">
            {question}
          </AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
