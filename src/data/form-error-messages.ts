export const FORM_ERROR_MESSAGES = {
  REQUIRED: "To pole jest wymagane",
  NONEMPTY: "To pole jest wymagane",
  INVALID_EMAIL: "Niepoprawny adres email",
  CONDITIONALLY_REQUIRED: "Należy wypełnić oba pola lub żadne z nich",
  INVALID_DEPARTMENT_CODE:
    "Niepoprawny kod wydziału. Musi zaczynać się od litery 'W' i zawierać 1-2 cyfry.",
  INVALID_DEPARTMENT_BETTER_CODE:
    "Niepoprawny kod wydziału. Musi zawierać tylko duże litery i zaczynać się od 'W'.",
  INVALID_TOPIC_NAME:
    "Niepoprawna nazwa. Dozwolone są tylko litery, cyfry oraz znaki - _ . ~ %",
  SELECTION_REQUIRED: "Należy wybrać przynajmniej jedną opcję",
  VALUE_TOO_SHORT: (valueLength: number) =>
    `Wpisana wartość jest za krótka. Minimalna długość: ${String(valueLength)}`,
};
