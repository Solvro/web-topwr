"use client";

import { Form, required, useLogin } from "ra-core";
import { useState } from "react";

import { RaTextInput } from "@/components/ra-text-input";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const login = useLogin();
  const [currentError, setCurrentError] = useState<string | null>(null);

  return (
    <div>
      <Form
        onSubmit={async (values: unknown) => {
          try {
            setCurrentError(null);
            await login(values as { email: string; password: string });
          } catch (error) {
            setCurrentError((error as Error).message);
          }
        }}
      >
        <RaTextInput
          label="Email"
          source="email"
          type="email"
          validate={required()}
        />
        <RaTextInput
          label="Password"
          source="password"
          type="password"
          validate={required()}
        />
        <Button type="submit">Login</Button>
      </Form>
      {currentError != null && currentError.trim() !== "" ? (
        <span className="text-red-600">{currentError}</span>
      ) : null}
    </div>
  );
}
