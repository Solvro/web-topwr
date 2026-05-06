export const FORM_ERROR_MESSAGES = {
  REQUIRED: "To pole jest wymagane",
  NONEMPTY: "To pole jest wymagane",
  INVALID_EMAIL: "Niepoprawny adres email",
  INVALID_URL: "Niepoprawny adres URL",
  CONDITIONALLY_REQUIRED: "Należy wypełnić oba pola lub żadne z nich",
  INVALID_DEPARTMENT_CODE:
    "Kod wydziału z numerem może zawierać co najwyżej 3 znaki",
  INVALID_DEPARTMENT_BETTER_CODE:
    "Kod wydziału ze skrótem może zawierać co najwyżej 5 znaków",
  INVALID_TOPIC_NAME:
    "Niepoprawna nazwa. Dozwolone są tylko litery, cyfry oraz znaki - _ . ~ %",
  SELECTION_REQUIRED: "Należy wybrać przynajmniej jedną opcję",
  VALUE_TOO_SHORT: (requiredLength: number) =>
    `Wpisana wartość jest za krótka. Minimalna długość: ${String(requiredLength)}`,
  CHANGE_PASSWORD_MIN_LENGTH: "Hasło musi mieć co najmniej 8 znaków",
  CHANGE_PASSWORD_REQUIRE_UPPER:
    "Hasło musi zawierać co najmniej jedną wielką literę",
  CHANGE_PASSWORD_REQUIRE_LOWER:
    "Hasło musi zawierać co najmniej jedną małą literę",
  CHANGE_PASSWORD_REQUIRE_NUMBER: "Hasło musi zawierać co najmniej jedną cyfrę",
  CHANGE_PASSWORD_PASSWORDS_MUST_MATCH: "Hasła muszą być identyczne",
  CHANGE_PASSWORD_MUST_DIFFER: "Nowe hasło musi się różnić od starego",
};
