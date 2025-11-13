import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { getVersionedApiBase } from "@/features/backend";
import type { Resource } from "@/features/resources";
import { MOCK_FILES, MOCK_IMAGE_FILE } from "@/tests/shared";
import {
  InputComponentWrapper,
  getToaster,
  renderWithProviders,
  server,
} from "@/tests/unit";

import { ImageUpload } from "./image-upload";

const IMAGE_UPLOAD_LABEL = "TEST_IMAGE_UPLOAD_LABEL";

function ImageUploadMapper({
  value,
  onChange,
  existingImage,
}: {
  value?: string | null;
  onChange: (value: string | null) => void;
  existingImage?: string | null;
}) {
  return (
    <ImageUpload<Resource.StudentOrganizations>
      label={IMAGE_UPLOAD_LABEL}
      name="logoKey"
      onChange={onChange}
      value={value ?? null}
      existingImage={existingImage ?? null}
    />
  );
}

function renderImageUpload(initialValue?: string) {
  const screen = renderWithProviders(
    <InputComponentWrapper
      component={ImageUploadMapper}
      initialValue={initialValue}
      existingImage={initialValue}
    />,
  );
  const user = userEvent.setup();
  const trigger = screen.getByLabelText(
    new RegExp(IMAGE_UPLOAD_LABEL),
  ) as HTMLInputElement;
  expect(trigger).toBeInTheDocument();

  return { screen, user, trigger };
}

describe("ImageUpload Component", () => {
  it("should prompt file selection", () => {
    const { screen, trigger } = renderImageUpload();
    const triggerByPrompt = screen.getByLabelText(
      /kliknij, aby dodać zdjęcie/i,
    );
    expect(trigger).toEqual(triggerByPrompt);
  });

  it("should display existing image if provided", () => {
    const existingImageContent = "EXISTING_IMAGE_CONTENT";
    const { trigger } = renderImageUpload(existingImageContent);
    expect(trigger).toHaveTextContent(existingImageContent);
  });

  it("should allow file upload when clicked", async () => {
    const mockFile = MOCK_FILES[0];

    server.use(
      http.post(`${getVersionedApiBase()}/files`, () => {
        return HttpResponse.json({
          key: mockFile.id,
        });
      }),
    );

    const { screen, user, trigger } = renderImageUpload();
    await user.click(trigger);
    await user.upload(trigger, MOCK_IMAGE_FILE);

    expect(trigger.files).toHaveLength(1);
    expect(trigger.files?.item(0)).toStrictEqual(MOCK_IMAGE_FILE);
    expect(getToaster()).toHaveTextContent(/pomyślnie przesłano zdjęcie/i);
    const imageElement = screen.getByRole("img");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src");
    expect(imageElement.getAttribute("src")).toContain(mockFile.id);
  });
});
