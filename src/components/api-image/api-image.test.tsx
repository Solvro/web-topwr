import { faker } from "@faker-js/faker";
import { waitFor } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { ImageType } from "@/config/enums";
import { env } from "@/config/env";
import { MOCK_FILES } from "@/tests/shared";
import { getLoadingIndicator, renderWithProviders } from "@/tests/unit";

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
          <ApiImage
            key={image.id}
            imageKey={image.id}
            alt={image.alt}
            type={ImageType.Logo}
          />
        ))}
      </>,
    );
    await waitFor(() => {
      for (const image of MOCK_IMAGES) {
        const imageElement = screen.getByAltText(image.alt);
        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute(
          "src",
          `${env.NEXT_PUBLIC_API_URL}/uploads/${image.id}.${image.fileExtension}`,
        );
      }
    });
  });

  it("should render nothing for non-existing image", async () => {
    const alt = faker.lorem.sentence();
    const screen = renderWithProviders(
      <ApiImage
        imageKey="non-existing-image"
        alt={alt}
        type={ImageType.Banner}
      />,
    );
    expect(getLoadingIndicator()).toBeInTheDocument();
    await waitFor(
      () => {
        expect(getLoadingIndicator()).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
    const imageElement = screen.queryByAltText(alt);
    expect(imageElement).not.toBeInTheDocument();
  });
});
