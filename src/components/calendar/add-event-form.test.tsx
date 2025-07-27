import { userEvent } from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { API_URL } from "@/config/constants";
import { getErrorMessage } from "@/lib/error-handling";
import { renderWithProviders } from "@/tests/helpers";
import { server } from "@/tests/mocks/server";

import { AddEventForm } from "./add-event-form";

function renderAddEventForm() {
  const user = userEvent.setup();
  const screen = renderWithProviders(<AddEventForm />);

  const nameInput = screen.getByLabelText("Tytuł wydarzenia");
  const startTimeInput = screen.getByLabelText("Godzina rozpoczęcia");
  const endTimeInput = screen.getByLabelText("Godzina zakończenia");
  const descriptionTextarea = screen.getByLabelText("Opis wydarzenia");
  const locationInput = screen.getByLabelText("Lokalizacja");
  const submitButton = screen.getByRole("button", {
    name: /dodaj wydarzenie/i,
  });

  return {
    user,
    screen,
    nameInput,
    startTimeInput,
    endTimeInput,
    descriptionTextarea,
    locationInput,
    submitButton,
  };
}

const mockEventData = {
  name: "Test Event",
  description: "Test event description",
  location: "Test Location",
};

const mockApiResponse = {
  id: 1,
  name: "Test Event",
  description: "Test event description",
  location: "Test Location",
  startTime: "2025-07-26T14:30:00.000Z",
  endTime: "2025-07-26T15:30:00.000Z",
  googleCallId: null,
};

describe("AddEventForm Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form with proper structure and accessibility", () => {
    const form = renderAddEventForm();

    // Check that all form fields are present
    expect(form.nameInput).toBeInTheDocument();
    expect(form.startTimeInput).toBeInTheDocument();
    expect(form.endTimeInput).toBeInTheDocument();
    expect(form.descriptionTextarea).toBeInTheDocument();
    expect(form.locationInput).toBeInTheDocument();
    expect(form.submitButton).toBeInTheDocument();

    // Check form structure
    const formElement = form.screen.container.querySelector("form");
    expect(formElement).toBeInTheDocument();

    // Check time input attributes
    expect(form.startTimeInput).toHaveAttribute("type", "time");
    expect(form.endTimeInput).toHaveAttribute("type", "time");
    expect(form.startTimeInput).toHaveAttribute("step", "1");
    expect(form.endTimeInput).toHaveAttribute("step", "1");

    // Check proper labeling and accessibility
    expect(form.nameInput).toHaveAccessibleName("Tytuł wydarzenia");
    expect(form.startTimeInput).toHaveAccessibleName("Godzina rozpoczęcia");
    expect(form.endTimeInput).toHaveAccessibleName("Godzina zakończenia");
    expect(form.descriptionTextarea).toHaveAccessibleName("Opis wydarzenia");
    expect(form.locationInput).toHaveAccessibleName("Lokalizacja");

    // Check submit button
    expect(form.submitButton).toHaveAttribute("type", "submit");
    expect(form.submitButton).toHaveTextContent("Dodaj wydarzenie");
  });

  it("should successfully submit form and send correct data format", async () => {
    let receivedData: Record<string, unknown> | null = null;

    // Mock API response and capture request data
    server.use(
      http.post(`${API_URL}/event_calendar`, async ({ request }) => {
        receivedData = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(mockApiResponse, { status: 201 });
      }),
    );

    const form = renderAddEventForm();

    // Fill out the form (test user interaction)
    await form.user.type(form.nameInput, mockEventData.name);
    await form.user.type(form.descriptionTextarea, mockEventData.description);
    await form.user.type(form.locationInput, mockEventData.location);

    // Submit the form
    await form.user.click(form.submitButton);

    // Verify that error handling was not called
    expect(getErrorMessage).not.toHaveBeenCalled();

    // Verify correct data format was sent to API
    await vi.waitFor(() => {
      expect(receivedData).toMatchObject({
        name: mockEventData.name,
        description: mockEventData.description,
        location: mockEventData.location,
        googleCallId: null,
        startTime: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        ) as string,
        endTime: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        ) as string,
      });
    });
  });

  it("should show loading state during form submission", async () => {
    // Mock delayed API response
    server.use(
      http.post(`${API_URL}/event_calendar`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json(mockApiResponse, { status: 201 });
      }),
    );

    const form = renderAddEventForm();

    // Fill required fields
    await form.user.clear(form.nameInput);
    await form.user.type(form.nameInput, mockEventData.name);

    // Submit the form
    await form.user.click(form.submitButton);

    // Check loading state
    expect(form.submitButton).toBeDisabled();
    expect(form.submitButton).toHaveTextContent("Dodawanie...");

    // Wait for submission to complete
    await vi.waitFor(() => {
      expect(form.submitButton).not.toBeDisabled();
      expect(form.submitButton).toHaveTextContent("Dodaj wydarzenie");
    });
  });

  it("should handle API errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        // Mock implementation
      });

    // Mock API error response
    server.use(
      http.post(`${API_URL}/event_calendar`, () => {
        return HttpResponse.json(
          { error: { message: "Internal Server Error" } },
          { status: 500 },
        );
      }),
    );

    const form = renderAddEventForm();

    // Fill required fields
    await form.user.clear(form.nameInput);
    await form.user.type(form.nameInput, mockEventData.name);

    // Submit the form
    await form.user.click(form.submitButton);

    // Wait for error handling
    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error submitting form:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("should validate required fields", async () => {
    const form = renderAddEventForm();

    // Try to submit without filling required name field
    await form.user.click(form.submitButton);

    // Should show validation error for name field
    await vi.waitFor(() => {
      expect(
        form.screen.getByText("Tytuł wydarzenia jest wymagany"),
      ).toBeInTheDocument();
    });
  });

  it("should handle optional fields correctly", async () => {
    // Mock successful API response
    server.use(
      http.post(`${API_URL}/event_calendar`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;

        // Verify optional fields are handled correctly when empty
        expect(body.description).toBe("");
        expect(body.location).toBe("");
        expect(body.googleCallId).toBeNull();

        return HttpResponse.json(mockApiResponse, { status: 201 });
      }),
    );

    const form = renderAddEventForm();

    // Only fill required field, leave optional fields empty
    await form.user.type(form.nameInput, "Required Event Name");

    // Submit the form
    await form.user.click(form.submitButton);

    // Wait for submission to complete
    await vi.waitFor(() => {
      expect(form.submitButton).not.toBeDisabled();
    });
  });

  it("should validate required fields", async () => {
    const form = renderAddEventForm();

    // Try to submit without filling required name field
    await form.user.click(form.submitButton);

    // Should show validation error for name field
    await vi.waitFor(() => {
      expect(
        form.screen.getByText("Tytuł wydarzenia jest wymagany"),
      ).toBeInTheDocument();
    });
  });

  it("should handle API errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        // Mock implementation
      });

    // Mock API error response
    server.use(
      http.post(`${API_URL}/event_calendar`, () => {
        return HttpResponse.json(
          { error: { message: "Internal Server Error" } },
          { status: 500 },
        );
      }),
    );

    const form = renderAddEventForm();

    // Fill required fields
    await form.user.type(form.nameInput, mockEventData.name);

    // Submit the form
    await form.user.click(form.submitButton);

    // Wait for error handling
    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error submitting form:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("should handle network errors", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        // Mock implementation
      });

    // Mock network error
    server.use(
      http.post(`${API_URL}/event_calendar`, () => {
        return HttpResponse.error();
      }),
    );

    const form = renderAddEventForm();

    // Fill required fields
    await form.user.type(form.nameInput, mockEventData.name);

    // Submit the form
    await form.user.click(form.submitButton);

    // Wait for error handling
    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error submitting form:",
        expect.any(Error),
      );
    });

    // Form should not be in loading state after error
    expect(form.submitButton).not.toBeDisabled();
    expect(form.submitButton).toHaveTextContent("Dodaj wydarzenie");

    consoleErrorSpy.mockRestore();
  });
});
