import { Resource } from "@/config/enums";
import type { AuthState } from "@/types/api";
import type { Declensions } from "@/types/polish";

import { getErrorMessage } from "./error-handling";
import { toTitleCase } from "./helpers";
import { declineNoun } from "./polish";

const getDefaultToastMessages = (declensions: Declensions) => ({
  read: {
    error: `Wystąpił nieoczekiwany błąd podczas wczytywania ${declensions.genitive}. Spróbuj ponownie później.`,
  },
  modify: {
    loading: "Trwa przetwarzanie...",
    success: "Pomyślnie zapisano!",
    error: "Wystąpił błąd podczas zapisywania.",
  },
  delete: {
    loading: `Trwa usuwanie ${declensions.genitive}...`,
    success: `Pomyślnie usunięto ${declensions.accusative}!`,
    error: `Wystąpił błąd podczas usuwania ${declensions.genitive}`,
  },
  toggleArchived: (isArchived: boolean) => ({
    loading: `Trwa ${isArchived ? "archiwizowanie" : "przywracanie"} ${declensions.genitive}...`,
    success: `${toTitleCase(declensions.nominative)} została ${isArchived ? "zarchiwizowana" : "przywrócona"}.`,
    error: `Nie udało się ${isArchived ? "zarchiwizować" : "przywrócić"} ${declensions.genitive}`,
  }),
});

type ToastMessages = ReturnType<typeof getDefaultToastMessages>;
type ResourceSpecificToastMessages = Record<
  Resource,
  Partial<ToastMessages> | undefined
>;

const getResourceSpecificToastMessages = (declensions: Declensions) =>
  ({
    [Resource.Notifications]: {
      modify: {
        loading: `Trwa wysyłanie ${declensions.genitive}...`,
        success: `Pomyślnie wysłano ${declensions.accusative}!`,
        error: `Wystąpił błąd podczas wysyłania ${declensions.genitive}.`,
      },
    },
  }) satisfies Partial<ResourceSpecificToastMessages>;

export const getToastMessages = {
  login: {
    loading: "Trwa logowanie...",
    success: (response: AuthState) =>
      `Pomyślnie zalogowano jako ${response.user.fullName ?? response.user.email}!`,
    error: (error: unknown) =>
      getErrorMessage(error, "Nastąpił błąd podczas logowania"),
  },
  object: (declensions: Declensions) => ({
    upload: {
      loading: `Trwa przesyłanie ${declensions.genitive}...`,
      success: `Pomyślnie przesłano ${declensions.accusative}!`,
      error: `Wystąpił błąd podczas przesyłania ${declensions.genitive}`,
    },
  }),
  resource: (resource: Resource) => {
    const declensions = declineNoun(resource);
    const defaultToastMessages = getDefaultToastMessages(declensions);
    const allSpecificToastMessages = getResourceSpecificToastMessages(
      declensions,
    ) as ResourceSpecificToastMessages;
    const specificToastMessages = allSpecificToastMessages[resource] ?? {};
    return {
      ...defaultToastMessages,
      ...specificToastMessages,
    };
  },
};
