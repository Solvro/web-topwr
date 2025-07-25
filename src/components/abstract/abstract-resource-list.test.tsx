import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import type { GuideArticle } from "@/types/app";

import { AbstractResourceList } from "./abstract-resource-list";

vi.mock("@/lib/fetch-utils", () => ({
  fetchQuery: vi.fn(),
}));

const mockFetchQuery = vi.mocked(fetchQuery);

const mockGuideArticles: GuideArticle[] = [
  {
    id: 1,
    title: "Test Article 1",
    shortDesc: "First test article description",
    description: "Detailed content for first article",
    imageKey: "test1.jpg",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Test Article 2",
    shortDesc: "Second test article description",
    description: "Detailed content for second article",
    imageKey: "test2.jpg",
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-02T00:00:00Z",
  },
  {
    id: 3,
    title: "Test Article 3",
    shortDesc: "",
    description: "Detailed content for third article",
    imageKey: "test3.jpg",
    createdAt: "2025-01-03T00:00:00Z",
    updatedAt: "2025-01-03T00:00:00Z",
  },
];

async function renderList(pageParameters?: { page: string }) {
  const parameters = pageParameters ?? { page: "1" };
  return render(
    await AbstractResourceList({
      resource: Resource.GuideArticles,
      searchParams: Promise.resolve(parameters),
      mapItemToList: (item: GuideArticle) => ({
        id: item.id,
        name: item.title,
        shortDescription: item.shortDesc,
      }),
      addButtonLabel: "Dodaj artykuł",
    }),
  );
}

describe("Abstract Resource List", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchQuery.mockResolvedValue({
      data: mockGuideArticles,
      meta: { total: 3 },
    });
  });

  it("renders the list correctly, including missing descriptions", async () => {
    await renderList();

    expect(screen.getByText("Test Article 1")).toBeInTheDocument();
    expect(screen.getByText("Test Article 2")).toBeInTheDocument();
    expect(screen.getByText("Test Article 3")).toBeInTheDocument();
    expect(
      screen.getByText("First test article description"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Second test article description"),
    ).toBeInTheDocument();
    expect(screen.getByText("Brak opisu")).toBeInTheDocument();
  });

  it("calls fetchQuery with correct params", async () => {
    await renderList({ page: "2" });
    expect(mockFetchQuery).toHaveBeenCalledWith(
      expect.stringContaining("guide_articles?page=2"),
    );
  });

  it("handles empty data gracefully", async () => {
    mockFetchQuery.mockResolvedValueOnce({ data: [], meta: { total: 0 } });
    await renderList();
    expect(screen.queryByText("Test Article 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Brak opisu")).not.toBeInTheDocument();
  });
});
