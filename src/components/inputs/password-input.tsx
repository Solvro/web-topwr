"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function PasswordInput({
  className,
  label = "Hasło",
  placeholder = "hasło",
  ...field
}: {
  className?: string;
  label?: string;
  placeholder?: string;
} & ControllerRenderProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <InputGroup className={className}>
        <FormControl>
          <InputGroupInput
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            {...field}
          />
        </FormControl>
        <InputGroupButton
          type="button"
          variant="ghost"
          tooltip={`${showPassword ? "Ukryj" : "Pokaż"} ${label.toLowerCase()}`}
          onClick={() => {
            setShowPassword((oldValue) => !oldValue);
          }}
        >
          {showPassword ? <Eye /> : <EyeClosed />}
        </InputGroupButton>
      </InputGroup>

      <FormMessage />
    </FormItem>
  );
}
