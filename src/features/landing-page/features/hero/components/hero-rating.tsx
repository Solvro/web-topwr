import { Star, StarHalf } from "lucide-react";

import { declineNumeric } from "@/features/polish";

import { APP_RATING } from "../constants";
import { formatRatingCount } from "../utils/format-rating-count";

const STAR_COUNT = 5;

export function HeroRating() {
  const fullStars = Math.floor(APP_RATING.score);
  const remainder = APP_RATING.score - fullStars;
  const hasHalfStar = remainder >= 0.25;

  const formattedScore = APP_RATING.score.toString().replace(".", ",");
  const formattedReviewsCount = formatRatingCount(APP_RATING.reviewsCount);

  const declinedNoun = declineNumeric(
    APP_RATING.reviewsCount,
    "ocena",
    "oceny",
    "ocen",
  )
    .split(" ")
    .slice(1)
    .join(" ");

  /* eslint-disable react/no-array-index-key */
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm sm:text-base">
      <div className="flex items-center gap-1">
        {Array.from({ length: STAR_COUNT }).map((_, index) => {
          if (index < fullStars) {
            return (
              <Star key={index} className="fill-primary text-primary size-5" />
            );
          }
          if (index === fullStars && hasHalfStar) {
            return (
              <StarHalf
                key={index}
                className="fill-primary text-primary size-5"
              />
            );
          }
          return <Star key={index} className="size-5 opacity-0" />;
        })}
        <span className="font-bold">{formattedScore}</span>
      </div>

      <p className="text-muted-foreground text-xs sm:text-sm">
        <span className="hidden sm:inline" aria-hidden="true">
          •{" "}
        </span>
        ponad {formattedReviewsCount}&nbsp;{declinedNoun} w&nbsp;App&nbsp;Store
        i&nbsp;Google&nbsp;Play
      </p>
    </div>
  );
}
