export enum GrammaticalGender {
  Neuter = 0,
  Masculine = 1,
  Feminine = 2,
}

export enum GrammaticalCase {
  /** Mianownik – kto? co? */
  Nominative = "nominative",
  /** Dopełniacz – kogo? czego? */
  Genitive = "genitive",
  /** Celownik – komu? czemu? */
  Dative = "dative",
  /** Biernik – kogo? co? */
  Accusative = "accusative",
  /** Narzędnik – z kim? z czym? */
  Instrumental = "instrumental",
  /** Miejscownik – o kim? o czym? */
  Locative = "locative",
  /** Wołacz – o! */
  Vocative = "vocative",
}
