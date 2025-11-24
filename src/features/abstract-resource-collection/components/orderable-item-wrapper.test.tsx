import { faker } from "@faker-js/faker";
import { fireEvent } from "@testing-library/dom";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { RESOURCE_METADATA, Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";
import { mockDatedResource } from "@/tests/shared";
import { renderWithProviders } from "@/tests/unit";
import type { ResourceRelations } from "@/types/components";

import { OrderableItemWrapper } from "./orderable-item-wrapper";

const resource = Resource.GuideArticles;
const relatedResources: ResourceRelations<Resource.GuideArticles> = {
  [Resource.GuideAuthors]: [],
  [Resource.GuideQuestions]: [],
};
type ResourceType = typeof resource;

const generateGuideArticle = (
  overrides: Partial<ResourceDataType<ResourceType>>,
): ResourceDataType<ResourceType> => ({
  ...mockDatedResource(),
  id: faker.number.int(),
  description: faker.lorem.paragraph(),
  title: faker.lorem.words(5),
  shortDesc: faker.lorem.sentence(),
  imageKey: faker.string.uuid(),
  order: faker.number.int({ min: 0, max: 100 }),
  ...overrides,
});

const MOCK_DATA: ResourceDataType<ResourceType>[] = [
  generateGuideArticle({ title: "[0]>" }),
  generateGuideArticle({ title: "[1]>" }),
  generateGuideArticle({ title: "[2]>" }),
];

function renderOrderableList() {
  const user = userEvent.setup();
  const screen = renderWithProviders(
    <OrderableItemWrapper
      resource={resource}
      data={MOCK_DATA}
      relatedResources={relatedResources}
    />,
  );
  const draggableItems = screen.getAllByRole("button", {
    description: /draggable item/i,
  });
  return { screen, user, draggableItems };
}

const height = 20;
const width = 100;

const mockGetBoundingClientRect = (element: HTMLElement, index: number) =>
  vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => ({
    bottom: 0,
    height,
    left: 0,
    right: 0,
    top: index * height,
    width,
    x: 0,
    y: index * height,
    toJSON: vi.fn(),
  }));

describe("OrderableItemWrapper for AbstractResourceList", () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetHeight",
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth",
  );

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: height,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: width,
    });
  });

  afterAll(() => {
    if (originalOffsetHeight == null || originalOffsetWidth == null) {
      expect.fail("failed to reset original offset dimensions");
    }
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetHeight",
      originalOffsetHeight,
    );
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetWidth",
      originalOffsetWidth,
    );
  });

  it("should render each draggable item", () => {
    const { screen, draggableItems } = renderOrderableList();
    for (const item of MOCK_DATA) {
      const mappedData = RESOURCE_METADATA[resource].itemMapper(item);
      expect(screen.getByText(mappedData.name)).toBeInTheDocument();
      expect(screen.getByText(mappedData.shortDescription)).toBeInTheDocument();
    }
    expect(draggableItems).toHaveLength(MOCK_DATA.length);
  });

  it("should allow items to be reordered", async () => {
    const { screen, draggableItems } = renderOrderableList();

    const items = screen.getAllByRole("listitem");
    for (const [index, draggable] of items.entries()) {
      mockGetBoundingClientRect(draggable, index);
    }

    expect(items).toHaveLength(MOCK_DATA.length);

    const firstItem = draggableItems[0];

    await userEvent.click(firstItem);
    fireEvent.keyDown(firstItem, { code: "Space" });
    // TODO: why does arrow down have to be pressed twice for this to pass?
    await userEvent.keyboard("[ArrowDown]");
    await userEvent.keyboard("[ArrowDown]");
    fireEvent.keyDown(firstItem, { code: "Space" });

    await act(async () => {
      // TODO: why is there a warning in the console without this `act`?
    });

    const reorderedItems = screen.getAllByRole("listitem");
    expect(reorderedItems).toHaveLength(MOCK_DATA.length);
    expect(reorderedItems[0]).toHaveTextContent(
      RESOURCE_METADATA[resource].itemMapper(MOCK_DATA[1]).name,
    );
    expect(reorderedItems[1]).toHaveTextContent(
      RESOURCE_METADATA[resource].itemMapper(MOCK_DATA[0]).name,
    );
  });
});
