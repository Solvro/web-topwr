import { faker } from "@faker-js/faker";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { Resource } from "@/config/enums";
import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { fetchQuery, getResourceApiBase } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { mockDatedResource } from "@/tests/shared";
import { renderWithProviders, server } from "@/tests/unit";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { ResourceDataType } from "@/types/app";

const resource = Resource.Banners;

const MOCK_BANNER = {
  id: 1,
  title: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  url: faker.internet.url(),
  draft: true,
  shouldRender: false,
  ...mockDatedResource(),
} satisfies ResourceDataType<Resource.Banners>;

async function renderEditPage(bannerId: number) {
  const id = sanitizeId(bannerId);

  const response = await fetchQuery<
    GetResourceWithRelationsResponse<typeof resource>
  >(id, { resource, includeRelations: true });

  const screen = renderWithProviders(
    await AbstractResourceForm({ resource, defaultValues: response.data }),
  );
  return { screen };
}

describe("edit page for existing banner", () => {
  it("reads banner data and populates form", async () => {
    server.use(
      http.get(
        `${getResourceApiBase(resource)}/${resource}/${String(MOCK_BANNER.id)}`,
        () => HttpResponse.json({ data: MOCK_BANNER }),
      ),
    );

    const { screen } = await renderEditPage(MOCK_BANNER.id);
    expect(screen.getByLabelText("Tytuł")).toHaveValue(MOCK_BANNER.title);
    expect(screen.getByLabelText("Opis")).toHaveValue(MOCK_BANNER.description);
    expect(screen.getByLabelText("URL")).toHaveValue(MOCK_BANNER.url);
    expect(screen.getByLabelText("Wersja robocza")).toBeChecked();
  });
});
