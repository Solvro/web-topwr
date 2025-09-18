import { faker } from "@faker-js/faker";
import { waitFor } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { API_FILES_URL } from "@/config/constants";
import { renderWithProviders } from "@/tests/helpers/react";
import { MOCK_FILES } from "@/tests/mocks/constants";

import { ApiImage } from "./client";

const MOCK_IMAGES = MOCK_FILES.map((file) => ({
  ...file,
  alt: faker.lorem.sentence(),
}));

describe("API Image component", () => {
  it("should render test images correctly", async () => {
    const screen = renderWithProviders(
      <>
        {MOCK_IMAGES.map((image) => (
          <ApiImage key={image.id} imageKey={image.id} alt={image.alt} />
        ))}
      </>,
    );
    await waitFor(() => {
      for (const image of MOCK_IMAGES) {
        const imageElement = screen.getByAltText(image.alt);
        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute(
          "src",
          `${API_FILES_URL}/${image.id}.${image.fileExtension}`,
        );
      }
    });
  });
});
