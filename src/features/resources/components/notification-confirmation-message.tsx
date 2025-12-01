import { declineNumeric } from "@/features/polish";
import { quoteText } from "@/utils";

import type { Resource } from "../enums";
import type { ConfirmationMessageProps } from "../types/internal";

export function NotificationConfirmationMessage({
  item,
}: ConfirmationMessageProps<Resource.Notifications>) {
  const selected = item.topics.length === 1 ? "wybranej" : "wybranych";
  const selectedTopicsCount = declineNumeric(item.topics.length, "category");
  const quotedTopics = item.topics.map((topic) => quoteText(topic)).join(", ");
  return (
    <>
      <p>
        Powiadomienie zostanie wysłane wszystkim subskrybentom {selected}{" "}
        kategorii.
      </p>
      <p>
        {item.topics.length === 0 ? (
          <>Nie wybrano żadnych kategorii</>
        ) : (
          <>
            Wybrano {selectedTopicsCount}: {quotedTopics}
          </>
        )}
        .
      </p>
    </>
  );
}
