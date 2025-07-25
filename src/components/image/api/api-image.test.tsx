import { screen, waitFor } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { API_FILES_URL } from "@/config/constants";
import { renderWithProviders } from "@/tests/helpers";

import { ApiImage } from "./client";

const TEST_IMAGE_KEYS = ["8b1e3069-1ec1-4735-b39d-e173a35d3a58"]; // TODO: ensure this file is created before tests

const generateAltText = (key: number) =>
  `Test image for key ${String(key + 1)}`;

describe("API Image component", () => {
  it("should render test images correctly", async () => {
    renderWithProviders(
      <>
        {TEST_IMAGE_KEYS.map((key, index) => (
          <ApiImage key={key} imageKey={key} alt={generateAltText(index)} />
        ))}
      </>,
    );
    await waitFor(() => {
      for (const [index, imageKey] of TEST_IMAGE_KEYS.entries()) {
        const image = screen.getByAltText(generateAltText(index));
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
          "src",
          `${API_FILES_URL}/${imageKey}.png`,
        );
      }
    });
  });
});
