import { ApplicationError } from "@/config/enums";

export const APPLICATION_ERROR_MESSAGES: Record<ApplicationError, string> = {
  [ApplicationError.Unauthorized]: "Ta strona wymaga zalogowania",
  [ApplicationError.Forbidden]: "Nie masz uprawnień do przeglądania tej strony",
  [ApplicationError.NotFound]: "Nie znaleziono podanej strony",
  [ApplicationError.ServerError]: "Wystąpił nieoczekiwany błąd serwera",
  [ApplicationError.NotImplemented]:
    "Ta strona nie jest jeszcze gotowa. Wróć tu za niedługo!",
};
