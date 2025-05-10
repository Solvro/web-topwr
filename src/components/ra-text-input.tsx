import { useInput } from "react-admin";
import type { InputProps } from "react-admin";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "./ui/input";

export function RaTextInput(props: InputProps) {
  const { field } = useInput(props);

  return (
    <FormItem>
      <FormLabel>{props.label}</FormLabel>
      <FormControl>
        <Input {...field} type={props.type} />
      </FormControl>
      <FormDescription>{props.helperText}</FormDescription>
    </FormItem>
  );
}
