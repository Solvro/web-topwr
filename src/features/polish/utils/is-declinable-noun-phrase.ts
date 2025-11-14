import { NOUN_PHRASE_TRANSFORMATIONS } from "../data/noun-phrase-transformations";
import type { DeclinableNoun, DeclinableNounPhrase } from "../types/internal";

export const isDeclinableNounPhrase = (
  noun: DeclinableNoun,
): noun is DeclinableNounPhrase => noun in NOUN_PHRASE_TRANSFORMATIONS;
