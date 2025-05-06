/* eslint-disable @typescript-eslint/require-await */
import type { AuthProvider } from "react-admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// TODO: use anything more secure than localStorage 😭

export const authProvider: AuthProvider = {
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    if (API_URL == null) {
      throw new Error("API_URL is not defined");
    }

    const data = { email, password, rememberMe: true };
    const url = `${API_URL}api/v1/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const message = `Login failed (${String(response.status)})`;
      throw new Error(message);
    }

    const jsonResponse = (await response.json()) as {
      token: string;
    };
    localStorage.setItem("token", jsonResponse.token);
  },

  async checkError(error: { status: number }): Promise<void> {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      throw new Error("Session expired");
    }
    // other error codes (404, 500, etc): no need to log out
  },

  async checkAuth(): Promise<void> {
    const token = localStorage.getItem("token");
    if (token == null || token === "") {
      throw new Error("Not authenticated");
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem("token");
  },

  // optional methods
  //   async getIdentity() {
  //     /* ... */
  //   },
  //   async handleCallback() {
  //     /* ... */
  //   }, // for third-party authentication only
  //   async canAccess(params) {
  //     /* ... */
  //   }, // for authorization only
  //   async getPermissions() {
  //     /* ... */
  //   }, // for authorization only
};
