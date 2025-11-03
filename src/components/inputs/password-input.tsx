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
import { Toggle } from "@/components/ui/toggle";

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
  const labelLowerCase = label.toLowerCase();
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
          asChild
          tooltip={`${showPassword ? "Ukryj" : "Pokaż"} ${labelLowerCase}`}
        >
          <Toggle
            size="unset"
            aria-label={`Pokaż ${labelLowerCase}`}
            pressed={showPassword}
            onPressedChange={setShowPassword}
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </Toggle>
        </InputGroupButton>
      </InputGroup>

      <FormMessage />
    </FormItem>
  );
}
