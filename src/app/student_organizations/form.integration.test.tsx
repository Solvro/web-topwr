import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { Toaster } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Form } from "@/app/student_organizations/form";
import { API_URL, SELECT_OPTION_LABELS } from "@/config/constants";
import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/config/enums";
import { renderWithProviders } from "@/tests/helpers";
import { server } from "@/tests/mocks/server";

interface StudentOrgPayload {
  name: string;
  shortDescription?: string | null;
  departmentId?: number | null;
  source?: string;
  organizationType?: string;
  organizationStatus?: string;
  isStrategic?: boolean;
  [key: string]: unknown;
}

let lastRequestBody: StudentOrgPayload | null = null;

const POST_ENDPOINT = new RegExp(`${API_URL}/student_organizations/?$`);

const renderForm = () =>
  renderWithProviders(
    <>
      <Toaster />
      <Form initialData={null} />
    </>,
  );

beforeEach(() => {
  lastRequestBody = null;
});

afterEach(() => {
  server.resetHandlers();
});

const NEW_ORG = { name: "Solvro", shortDescription: "Opis" };

describe("Adding organization test", () => {
  it("validates empty fields", async () => {
    const user = userEvent.setup();
    const { container } = renderForm();

    await user.type(screen.getByLabelText(/nazwa/i), "   ");
    await user.click(screen.getByRole("button", { name: /zapisz/i }));

    await waitFor(() => {
      const errors = container.querySelectorAll(".text-destructive");
      expect(errors).toHaveLength(1);
    });
  });

  it("sends payload and shows success toast", async () => {
    server.use(
      http.post(POST_ENDPOINT, async ({ request }) => {
        lastRequestBody = (await request.json()) as StudentOrgPayload;
        return HttpResponse.json(
          { id: 1, ...lastRequestBody },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/nazwa/i), NEW_ORG.name);
    await user.type(
      screen.getByLabelText(/krótki opis/i),
      NEW_ORG.shortDescription,
    );
    await user.click(screen.getByRole("button", { name: /zapisz/i }));

    const successMsgs = await screen.findAllByText(/pomyślnie zapisano/i);
    expect(successMsgs.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(lastRequestBody).toMatchObject(NEW_ORG);
    });
  });

  it("handles 500 error and shows error toast", async () => {
    server.use(
      http.post(POST_ENDPOINT, () => HttpResponse.json({}, { status: 500 })),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/nazwa/i), NEW_ORG.name);
    await user.type(
      screen.getByLabelText(/krótki opis/i),
      NEW_ORG.shortDescription,
    );
    await user.click(screen.getByRole("button", { name: /zapisz/i }));

    await waitFor(() => {
      const errorToast = document.querySelector(
        'li[data-sonner-toast][data-type="error"]',
      );
      expect(errorToast).not.toBeNull();
    });
  });

  it("sends payload with all fields and checks", async () => {
    server.use(
      http.post(POST_ENDPOINT, async ({ request }) => {
        lastRequestBody = (await request.json()) as StudentOrgPayload;
        return HttpResponse.json(
          { id: 99, ...lastRequestBody },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/nazwa/i), NEW_ORG.name);
    await user.type(
      screen.getByLabelText(/krótki opis/i),
      NEW_ORG.shortDescription,
    );

    await user.click(screen.getByLabelText(/wydział/i));
    await user.click(
      screen.getByRole("option", {
        name: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.DEPARTMENT[
          DepartmentIds.Architecture
        ],
      }),
    );

    await user.click(screen.getByLabelText(/źródło/i));
    await user.click(
      screen.getByRole("option", {
        name: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.SOURCE[
          OrganizationSource.Manual
        ],
      }),
    );

    await user.click(screen.getByLabelText(/typ/i));
    await user.click(
      screen.getByRole("option", {
        name: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.TYPE[
          OrganizationType.ScientificClub
        ],
      }),
    );

    await user.click(screen.getByLabelText(/status/i));
    await user.click(
      screen.getByRole("option", {
        name: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.STATUS[
          OrganizationStatus.Active
        ],
      }),
    );

    await user.click(screen.getByLabelText(/czy jest kołem strategicznym/i));

    await user.click(screen.getByRole("button", { name: /zapisz/i }));

    await waitFor(() => {
      expect(lastRequestBody).toMatchObject({
        name: NEW_ORG.name,
        shortDescription: NEW_ORG.shortDescription,
        departmentId: DepartmentIds.Architecture,
        source: OrganizationSource.Manual,
        organizationType: OrganizationType.ScientificClub,
        organizationStatus: OrganizationStatus.Active,
        isStrategic: true,
      });
    });
  });

  it("handles 400 error and shows default error toast", async () => {
    server.use(
      http.post(POST_ENDPOINT, () =>
        HttpResponse.json({ message: "Incorrect" }, { status: 400 }),
      ),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/nazwa/i), NEW_ORG.name);
    await user.click(screen.getByRole("button", { name: /zapisz/i }));

    const toasts = await screen.findAllByText(
      /wystąpił błąd podczas zapisywania/i,
    );
    expect(toasts.length).toBeGreaterThan(0);
  });
  it("keeps uploaded image in file input after validation error", async () => {
    if (!("createObjectURL" in URL)) {
      Object.defineProperty(URL, "createObjectURL", {
        writable: true,
        value: vi.fn(),
      });
    }

    const user = userEvent.setup();
    renderForm();

    const fileInput: HTMLInputElement = screen.getByLabelText(/logo/i);
    const file = new File(["(≧U≦)"], "logo.png", { type: "image/png" });

    await user.upload(fileInput, file);

    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0].name).toBe("logo.png");

    await user.click(screen.getByRole("button", { name: /zapisz/i }));

    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0].name).toBe("logo.png");
  });
  it("sends isStrategic=true when checkbox toggled via keyboard", async () => {
    let capturedBody: StudentOrgPayload | null = null;
    server.use(
      http.post(POST_ENDPOINT, async ({ request }) => {
        capturedBody = (await request.json()) as StudentOrgPayload;
        return HttpResponse.json({ id: 15, ...capturedBody }, { status: 201 });
      }),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/nazwa/i), NEW_ORG.name);

    const checkbox = screen.getByRole("checkbox", {
      name: /kołem strategicznym/i,
    });

    checkbox.focus();
    expect(checkbox).toHaveFocus();

    await user.keyboard("[Space]");

    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getByRole("button", { name: /zapisz/i }));

    await waitFor(() => {
      expect(capturedBody?.isStrategic).toBe(true);
    });
  });

  it("submits form when user presses enter inside text field", async () => {
    let lastBody: StudentOrgPayload | null = null;
    server.use(
      http.post(POST_ENDPOINT, async ({ request }) => {
        lastBody = (await request.json()) as StudentOrgPayload;
        return HttpResponse.json({ id: 77, ...lastBody }, { status: 201 });
      }),
    );

    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/nazwa/i);
    await user.type(nameInput, NEW_ORG.name);

    await user.keyboard("{Enter}");

    const successToasts = await screen.findAllByText(/pomyślnie zapisano/i);
    expect(successToasts.length).toBeGreaterThan(0);

    expect(lastBody).toMatchObject({ name: NEW_ORG.name });
  });
});
