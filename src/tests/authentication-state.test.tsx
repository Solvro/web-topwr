import { act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { API_URL } from "@/config/constants";
import { useAuth } from "@/hooks/use-auth";
import { authStateAtom } from "@/stores/auth";
import { getToaster, renderWithProviders } from "@/tests/helpers";
import { MOCK_PASSWORD, MOCK_TOKEN, MOCK_USER } from "@/tests/mocks/constants";
import { server } from "@/tests/mocks/server";

function TestAuthComponent({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {auth.isAuthenticated ? "authenticated" : "not-authenticated"}
      </div>
      {auth.isAuthenticated ? (
        <div data-testid="user-info">
          <span data-testid="user-email">{auth.user.email}</span>
          <span data-testid="user-name">{auth.user.fullName ?? ""}</span>
        </div>
      ) : null}
      <button
        data-testid="login-button"
        onClick={async () => {
          await auth.login({
            email,
            password,
            rememberMe: false,
          });
        }}
      >
        Login
      </button>
      <button
        data-testid="logout-button"
        onClick={async () => {
          await auth.logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}

function renderTestAuthComponent({
  email = MOCK_USER.valid.email,
  password = MOCK_PASSWORD.valid,
}: {
  email?: string;
  password?: string;
} = {}) {
  const user = userEvent.setup();
  const screen = renderWithProviders(
    <TestAuthComponent email={email} password={password} />,
  );
  const authStatus = screen.getByTestId("auth-status");
  return {
    user,
    screen,
    authStatus,
  };
}

describe("Authentication State", () => {
  it("should start in unauthenticated state", () => {
    const testComponent = renderTestAuthComponent();

    expect(testComponent.authStatus).toHaveTextContent("not-authenticated");
    expect(
      testComponent.screen.queryByTestId("user-info"),
    ).not.toBeInTheDocument();
  });

  it("should authenticate user with valid credentials", async () => {
    const testComponent = renderTestAuthComponent();

    await testComponent.user.click(
      testComponent.screen.getByTestId("login-button"),
    );

    expect(testComponent.authStatus).toHaveTextContent("authenticated");
    expect(testComponent.screen.getByTestId("user-email")).toHaveTextContent(
      MOCK_USER.valid.email,
    );
  });

  it("should handle logout correctly", async () => {
    const testComponent = renderTestAuthComponent();

    act(() => {
      testComponent.screen.store.set(authStateAtom, {
        user: MOCK_USER.valid,
        token: MOCK_TOKEN.valid,
      });
    });
    server.use(
      http.post(`${API_URL}/auth/logout`, () =>
        HttpResponse.json({
          success: true,
          message: "Logged out successfully",
        }),
      ),
    );
    await testComponent.user.click(
      testComponent.screen.getByTestId("logout-button"),
    );

    expect(testComponent.authStatus).toHaveTextContent("not-authenticated");
    expect(getToaster()).toHaveTextContent(/pomyślnie/i);
  });
});
