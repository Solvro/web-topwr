import { faker } from "@faker-js/faker";
import { waitFor } from "@testing-library/dom";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { API_FILES_URL } from "@/config/constants";
import { uploadFile } from "@/lib/helpers";
import { deleteAccessToken, generateAccessToken } from "@/tests/helpers/auth";
import { renderWithProviders } from "@/tests/helpers/react";

import { ApiImage } from "./client";

interface ImageFile {
  filename: string;
  alt: string;
  uuid: string;
}

const TEST_IMAGE_COUNT = 3;

function generateTestImage(): { file: File; extension: string; alt: string } {
  const name = faker.lorem.slug();
  const extension = faker.helpers.arrayElement(["png", "jpg", "jpeg"]);
  const filename = `${name}.${extension}`;
  const alt = faker.lorem.sentence();
  const data = faker.image.dataUri();
  return {
    file: new File([data], filename, { type: `image/${extension}` }),
    extension,
    alt,
  };
}

let accessToken: string;
let refreshToken: string;

describe("API Image component", () => {
  let testImages: ImageFile[] = [];

  beforeAll(async () => {
    ({ accessToken, refreshToken } = await generateAccessToken());

    testImages = await Promise.all(
      Array.from({ length: TEST_IMAGE_COUNT }).map(
        async (): Promise<ImageFile> => {
          const { file, alt, extension } = generateTestImage();
          const { uuid, response } = await uploadFile({
            file,
            extension,
            accessTokenOverride: accessToken,
          });
          return { uuid, filename: response.key, alt };
        },
      ),
    );
  }, 15_000);

  afterAll(async () => {
    // This code won't work because the backend hasn't implemented DELETE /api/v1/files/:uuid yet
    // await Promise.all(
    //   testImages.map(async (image) => {
    //     await fetchMutation(`files/${image.uuid}`, {
    //       method: "DELETE",
    //       accessTokenOverride,
    //     });
    //   }),
    // );

    await deleteAccessToken(accessToken, refreshToken);
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
