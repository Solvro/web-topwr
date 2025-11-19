import type { Declensions } from "@/features/polish/types";

export const INPUT_COMPONENT_MESSAGES = {
  immutableFieldDisabled: (declensions: Declensions) =>
    `Tego pola nie można zmieniać po utworzeniu ${declensions.genitive}.`,
};
