import type { Messages } from "next-intl";

export const FAQ_QUESTION_IDS = [
  "isFree",
  "placeholder2",
  "placeholder3",
  "placeholder4",
  "placeholder5",
] as const satisfies (keyof Messages["Faq"]["questions"])[];
