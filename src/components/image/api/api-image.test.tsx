import { waitFor } from "@testing-library/dom";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { API_FILES_URL } from "@/config/constants";
import { fetchMutation } from "@/lib/fetch-utils";
import { uploadFile } from "@/lib/helpers";
import { deleteAccessToken, generateAccessToken } from "@/tests/helpers/auth";
import { renderWithProviders } from "@/tests/helpers/react";

import { ApiImage } from "./client";

interface ImageFile {
  filename: string;
  alt: string;
}

const TEST_IMAGES_DIRECTORY = "src/tests/assets/images";

const TEST_IMAGES: ImageFile[] = [
  // { filename: "lenna.png", alt: "Lenna test image" },
  { filename: "blue.png", alt: "Tiny blue test image" },
];

let accessTokenOverride: string;

describe("API Image component", () => {
  let testImages: (ImageFile & { uuid: string })[] = [];

  beforeAll(async () => {
    accessTokenOverride = await generateAccessToken();

    testImages = await Promise.all(
      TEST_IMAGES.map(async (image) => {
        const filepath = path.join(TEST_IMAGES_DIRECTORY, image.filename);
        const { uuid, response } = await uploadFile(
          filepath, // TODO: actually read the file
          accessTokenOverride,
        );
        return { uuid, filename: response.key, alt: image.alt };
      }),
    );
  });

  afterAll(async () => {
    await Promise.all(
      testImages.map(async (image) => {
        await fetchMutation(`files/${image.uuid}`, {
          method: "DELETE",
          accessTokenOverride,
        });
      }),
    );

    await deleteAccessToken(accessTokenOverride);
  });

  it("should render test images correctly", async () => {
    const screen = renderWithProviders(
      <>
        {testImages.map((image) => (
          <ApiImage key={image.uuid} imageKey={image.uuid} alt={image.alt} />
        ))}
      </>,
    );
    await waitFor(() => {
      for (const image of testImages) {
        const imageElement = screen.getByAltText(image.alt);
        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute(
          "src",
          `${API_FILES_URL}/${image.filename}`,
        );
      }
    });
  });
});
