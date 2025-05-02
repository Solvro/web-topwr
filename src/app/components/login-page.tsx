"use client";

import { Form, required, useLogin } from "ra-core";

import { RaInput } from "@/components/ra-input";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const login = useLogin();

  return (
    <Form
      onSubmit={async (values: unknown) =>
        login(values as { email: string; password: string })
      }
    >
      <p>login/haslo: john 123</p>
      <RaInput
        label="Email"
        source="email"
        type="email"
        validate={required()}
      />
      <RaInput
        label="Password"
        source="password"
        type="password"
        validate={required()}
      />
      <Button type="submit">Login</Button>
    </Form>
  );
}
