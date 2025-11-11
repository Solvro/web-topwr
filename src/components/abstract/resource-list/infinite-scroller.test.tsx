import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LIST_RESULTS_PER_PAGE } from "@/config/constants";
import { Resource } from "@/config/enums";
import { fetchPaginatedResources } from "@/lib/helpers";
import {
  getLoadingIndicator,
  renderWithProviders,
} from "@/tests/helpers/react";

import { InfiniteScroller } from "./infinite-scroller";

const resource = Resource.StudentOrganizations;

async function renderInfiniteScroll() {
  const user = userEvent.setup();
  const initialData = await fetchPaginatedResources(resource);
  const screen = renderWithProviders(
    <InfiniteScroller resource={resource} initialData={initialData} />,
  );
  const showMoreButton = screen.getByRole("button", {
    name: /załaduj więcej/i,
  });
  expect(showMoreButton).toBeInTheDocument();
  return { user, screen, showMoreButton };
}

describe("Infinite Scroll Provider", () => {
  it("should load additional pages on-demand", async () => {
    const { user, screen, showMoreButton } = await renderInfiniteScroll();
    expect(screen.getAllByRole("listitem")).toHaveLength(LIST_RESULTS_PER_PAGE);

    await user.click(showMoreButton);
    expect(getLoadingIndicator()).toBeInTheDocument();
    await waitFor(() => {
      expect(getLoadingIndicator()).not.toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(
        LIST_RESULTS_PER_PAGE * 2,
      );
    });
  });
});
