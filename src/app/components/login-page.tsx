"use client";

import { Form, required, useLogin } from "ra-core";

import { RaInput } from "@/components/ra-input";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const login = useLogin();

  return (
    <Form
      className="space-y-8"
      onSubmit={async (values: unknown) =>
        login(values as { email: string; password: string })
      }
    >
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
