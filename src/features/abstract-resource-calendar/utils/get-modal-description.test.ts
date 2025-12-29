import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Resource } from "@/features/resources";

import type { MappedCalendarData } from "../types/internal";
import { getModalDescription } from "./get-modal-description";

const mockMappedData: MappedCalendarData = {
  dayEvents: {},
  semesters: {
    1: {
      semester: {
        id: 1,
        name: "Semestr zimowy 2023/24",
        semesterStartDate: "2023-10-01",
        examSessionStartDate: "2024-01-01",
        examSessionLastDate: "2024-01-31",
        isFirstWeekEven: true,
        createdAt: "",
        updatedAt: "",
      },
      semesterCard: null,
      semesterEvents: {
        "2024-01-15": {
          daySwaps: [null as ReactNode, null as ReactNode], // 2 day swaps
          holidays: [null as ReactNode], // 1 holiday
        },
        "2024-01-20": {
          daySwaps: [],
          holidays: [null as ReactNode, null as ReactNode], // 2 holidays
        },
      },
    },
    2: {
      semester: {
        id: 2,
        name: "Semestr letni 2023/24",
        semesterStartDate: "2024-02-01",
        examSessionStartDate: "2024-06-01",
        examSessionLastDate: "2024-06-30",
        isFirstWeekEven: false,
        createdAt: "",
        updatedAt: "",
      },
      semesterCard: null,
      semesterEvents: {},
    },
  },
};
describe("when clickedDay is null", () => {
  it("should return count of semesters when semesters exist", () => {
    const result = getModalDescription(
      Resource.AcademicSemesters,
      null,
      0,
      mockMappedData,
    );
    expect(result).toBe("Utworzono 2 semestry akademickie.");
  });

  it("should return no results message when no semesters", () => {
    const emptyMappedData: MappedCalendarData = {
      dayEvents: {},
      semesters: {},
    };

    const result = getModalDescription(
      Resource.AcademicSemesters,
      null,
      0,
      emptyMappedData,
    );
    expect(result).toBe("Brak semestrów akademickich");
  });
});

describe("when clickedDay is provided", () => {
  const clickedDay = "2024-01-15";

  it("should return resource count for simple resource without relations", () => {
    const result = getModalDescription(
      Resource.CalendarEvents,
      clickedDay,
      3,
      mockMappedData,
    );
    expect(result).toBe("W tym dniu zaplanowano 3 wydarzenia kalendarzowe.");
  });

  it("should return no events message for simple resource when count is 0", () => {
    const result = getModalDescription(
      Resource.CalendarEvents,
      clickedDay,
      0,
      mockMappedData,
    );
    expect(result).toBe("Brak wydarzeń kalendarzowych na ten dzień");
  });

  it("should count related resources from semester events", () => {
    const result = getModalDescription(
      Resource.AcademicSemesters,
      clickedDay,
      0,
      mockMappedData,
    );
    expect(result).toBe("W tym dniu zaplanowano 2 zamiany dni i 1 święto.");
  });

  it("should handle day with only holidays", () => {
    const result = getModalDescription(
      Resource.AcademicSemesters,
      "2024-01-20",
      0,
      mockMappedData,
    );
    expect(result).toBe("W tym dniu zaplanowano 2 święta.");
  });

  it("should handle day with no related resources", () => {
    const result = getModalDescription(
      Resource.AcademicSemesters,
      "2024-01-25",
      0,
      mockMappedData,
    );
    expect(result).toBe("Brak zamian dni i świąt na ten dzień");
  });
});
