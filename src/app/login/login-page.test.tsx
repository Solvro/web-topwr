import { userEvent } from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { API_ERROR_MESSAGES, API_URL } from "@/config/constants";
import { getErrorMessage } from "@/lib/error-handling";
import { getToaster, renderWithProviders } from "@/tests/helpers/react";
import { MOCK_PASSWORD, MOCK_TOKEN, MOCK_USER } from "@/tests/mocks/constants";
import { MOCK_USE_ROUTER } from "@/tests/mocks/functions";
import { server } from "@/tests/mocks/server";

import LoginPage from "./page";

function renderLoginPage() {
  const user = userEvent.setup();
  const screen = renderWithProviders(<LoginPage />);
  const inputEmail = screen.getByLabelText("Email");
  const inputPassword = screen.getByLabelText("Hasło");
  const inputRememberMe = screen.getByRole("checkbox");
  const submitButton = screen.getByRole("button");
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
async function enterValidCredentials() {
  const form = renderLoginPage();

  await form.user.type(form.inputEmail, MOCK_USER.valid.email);
  await form.user.type(form.inputPassword, MOCK_PASSWORD.valid);
  await form.user.click(form.inputRememberMe);
  await form.user.click(form.submitButton);

  expect(getErrorMessage).not.toHaveBeenCalled();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(MOCK_USE_ROUTER.push).toHaveBeenCalledExactlyOnceWith("/");

  expect(getToaster()).toHaveTextContent("Pomyślnie zalogowano");
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

  it("should accept valid credentials", enterValidCredentials);

  it("should fall back to email if user has no full name", async () => {
    const { fullName, ...user } = MOCK_USER.valid;
    server.use(
      http.post(`${API_URL}/auth/login`, () =>
        HttpResponse.json({ user, token: MOCK_TOKEN.valid }),
      ),
    );

    await enterValidCredentials();
    expect(getToaster()).toHaveTextContent(
      `Pomyślnie zalogowano jako ${user.email}`,
    );
  });
});
