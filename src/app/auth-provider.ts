/* eslint-disable @typescript-eslint/require-await */
import type { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    if (email !== "john" || password !== "123") {
      throw new Error("Login failed");
    }
    localStorage.setItem("email", email);
  },

  async checkError(error: { status: number }): Promise<void> {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("email");
      throw new Error("Session expired");
    }
    // other error codes (404, 500, etc): no need to log out
  },

  async checkAuth(): Promise<void> {
    const email = localStorage.getItem("email");
    if (email == null || email === "") {
      throw new Error("Not authenticated");
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem("email");
  },

  async getIdentity(): Promise<{ id: string; fullName?: string }> {
    const email = localStorage.getItem("email");
    if (email == null || email === "") {
      throw new Error("Not authenticated");
    }
    return { id: email, fullName: email || undefined };
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
