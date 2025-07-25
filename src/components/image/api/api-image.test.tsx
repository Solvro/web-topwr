import { waitFor } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/tests/helpers";

import { ApiImage } from "./client";

const TEST_IMAGE_KEYS = ["a53b2ad2-f57b-435e-a54e-cd43e436b4ab"];

const generateAltText = (key: number) =>
  `Test image for key ${String(key + 1)}`;

describe("API Image component", () => {
  it("should render test images correctly", async () => {
    const screen = renderWithProviders(
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
          `https://api.topwr.solvro.pl/uploads/${imageKey}.png`,
        );
      }
    });
  });
});
