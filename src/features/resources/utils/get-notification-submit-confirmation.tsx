import { declineNumeric } from "@/features/polish";
import { quoteText } from "@/utils";

import type { Resource } from "../enums";
import type { ResourceFormValues } from "../types";

export const getNotificationSubmitConfirmation = (
  item: ResourceFormValues<Resource.Notifications>,
) => {
  const selected = item.topics.length === 1 ? "wybranej" : "wybranych";
  const selectedTopicsCount = declineNumeric(
    item.topics.length,
    "kategorię",
    "kategorie",
    "kategorii",
  );
  const quotedTopics = item.topics.map((topic) => quoteText(topic)).join(", ");
  return {
    title: "Czy na pewno chcesz wysłać to powiadomienie?",
    description: (
      <div className="flex flex-col gap-2">
        <p>
          Powiadomienie zostanie wysłane wszystkim subksrybentom {selected}{" "}
          kategorii.
        </p>
        <p>
          Wybrano {selectedTopicsCount}: {quotedTopics}.
        </p>
      </div>
    ),
  };
};
