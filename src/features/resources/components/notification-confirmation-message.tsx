import { declineNumeric } from "@/features/polish";
import { quoteText } from "@/utils";

import type { Resource } from "../enums";
import type { ConfirmationMessageProps } from "../types/internal";

export function NotificationConfirmationMessage({
  item,
}: ConfirmationMessageProps<Resource.Notifications>) {
  const selected = item.topics.length === 1 ? "wybranej" : "wybranych";
  const selectedTopicsCount = declineNumeric(
    item.topics.length,
    "kategorię",
    "kategorie",
    "kategorii",
  );
  const quotedTopics = item.topics.map((topic) => quoteText(topic)).join(", ");
  return (
    <>
      <p>
        Powiadomienie zostanie wysłane wszystkim subskrybentom {selected}{" "}
        kategorii.
      </p>
      <p>
        Wybrano {selectedTopicsCount}: {quotedTopics}.
      </p>
    </>
  );
}
