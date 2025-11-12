import { userEvent } from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { API_ERROR_MESSAGES } from "@/config/constants";
import { getErrorMessage } from "@/lib/error-handling";
import { getVersionedApiBase } from "@/lib/helpers";
import { MOCK_PASSWORD, MOCK_USER } from "@/tests/shared";
import { getToaster, renderWithProviders, server } from "@/tests/unit";
import type { GetUserResponse } from "@/types/api";

import { LoginPage } from "./login-page";

function renderLoginPage() {
  const user = userEvent.setup();
  const screen = renderWithProviders(<LoginPage />);
  const inputEmail = screen.getByLabelText("Email");
  const inputPassword = screen.getByLabelText("Hasło");
  const inputRememberMe = screen.getByRole("checkbox", {
    name: /zapamiętaj mnie/i,
  });
  const submitButton = screen.getByRole("button", { name: /zaloguj się/i });
  return {
    user,
    screen,
    inputEmail,
    inputPassword,
    inputRememberMe,
    submitButton,
  };
}

/** Reusable test which simulates a successful login interaction. */
async function enterValidCredentials(expectedGreeting: string) {
  const form = renderLoginPage();

  await form.user.type(form.inputEmail, MOCK_USER.valid.email);
  await form.user.type(form.inputPassword, MOCK_PASSWORD.valid);
  await form.user.click(form.inputRememberMe);
  await form.user.click(form.submitButton);

  expect(getToaster()).toHaveTextContent(
    `Pomyślnie zalogowano jako ${expectedGreeting}`,
  );
}

describe("Login page", () => {
  it("should render the login form", () => {
    const form = renderLoginPage();
    expect(form.inputEmail).toBeInTheDocument();
    expect(form.inputPassword).toBeInTheDocument();
    expect(form.inputRememberMe).toBeInTheDocument();
    expect(form.submitButton).toBeInTheDocument();
  });

  it("should reject invalid password", async () => {
    const form = renderLoginPage();

    await form.user.type(form.inputEmail, MOCK_USER.valid.email);
    await form.user.type(form.inputPassword, MOCK_PASSWORD.invalid);
    expect(getErrorMessage).not.toHaveBeenCalled();
    await form.user.click(form.submitButton);

    expect(getErrorMessage).toHaveReturnedWith(
      API_ERROR_MESSAGES.E_INVALID_CREDENTIALS,
    );
  });

  it("should reject empty password", async () => {
    const form = renderLoginPage();

    await form.user.type(form.inputEmail, MOCK_USER.valid.email);
    expect(getErrorMessage).not.toHaveBeenCalled();
    await form.user.click(form.submitButton);

    expect(await form.screen.findByText(/wymagane/i)).toBeInTheDocument();
  });

  it("should accept valid credentials", async () => {
    await enterValidCredentials(MOCK_USER.valid.fullName);
  });

  it("should fall back to email if user has no full name", async () => {
    server.use(
      http.get(`${getVersionedApiBase()}/auth/me`, () =>
        HttpResponse.json<GetUserResponse>({
          ...MOCK_USER.valid,
          fullName: null,
        }),
      ),
    );

    await enterValidCredentials(MOCK_USER.valid.email);
  });
});
