import type { DeclinableNoun } from "@/features/polish/types";

import { NOUN_PHRASE_TRANSFORMATIONS } from "../data/noun-phrase-transformations";
import { SIMPLE_NOUN_DECLENSIONS } from "../data/simple-noun-declensions";

export const isDeclinableNoun = (value: unknown): value is DeclinableNoun =>
  typeof value === "string" &&
  (value in SIMPLE_NOUN_DECLENSIONS || value in NOUN_PHRASE_TRANSFORMATIONS);
