import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { describe, expect, it } from "vitest";

import { Resource } from "@/features/resources";

import { formatDateKey } from "./format-date-key";
import { getModalHeader } from "./get-modal-header";

describe("getModalHeader", () => {
  describe("when clickedDay is null", () => {
    it("should return resource name in nominative plural", () => {
      const result = getModalHeader(Resource.AcademicSemesters, null);
      expect(result).toBe("Semestry akademickie");
    });
  });

  describe("when clickedDay is provided", () => {
    const clickedDay = formatDateKey(new Date("2024-03-15"));

    const formattedClickedDay = format(clickedDay, "dd MMMM yyyy", {
      locale: pl,
    });

    it("should return resource name with date for resource without relations", () => {
      const result = getModalHeader(Resource.CalendarEvents, clickedDay);
      expect(result).toBe(`Wydarzenia kalendarzowe ${formattedClickedDay}`);
    });

    it("should return single related resource name with date when one OneToMany relation exists", () => {
      const result = getModalHeader(Resource.AcademicSemesters, clickedDay);
      expect(result).toBe(`Zamiany dni i święta ${formattedClickedDay}`);
    });
  });
});
