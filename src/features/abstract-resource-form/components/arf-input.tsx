import { Slot } from "@radix-ui/react-slot";
import type { ReactNode } from "react";

import { TooltipWrapper } from "@/components/core/tooltip-wrapper";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Declensions } from "@/features/polish/types";
import type { WrapperProps } from "@/types/components";

import { INPUT_COMPONENT_MESSAGES } from "../data/input-component-messages";
import type { FormInputBase } from "../types";

/**
 * Wraps a single input component with label, tooltip, and validation message.
 * Sets the input as disabled if the input definition marks it as immutable and the form is in editing mode.
 *
 * @param props - Component properties.
 * @param props.declensions - Declensions object used for localization/grammar.
 * @param props.isEditing - Flag indicating whether the form is currently in editing mode.
 * @param props.inputDefinition - Definitions for the input field.
 * @param props.tooltip - Controls the tooltip text behavior:
 * - `undefined`: Uses default behavior (shows immutable message if the input is disabled).
 * - `null`: Explicitly suppresses the tooltip, ensuring nothing is shown.
 * - `string`: Overrides the default and forces specific tooltip text to appear.
 * @param props.noControl - If true, renders without the form control.
 * @param props.noLabel - If true, hides the label.
 * @param props.actionButton - Optional ReactNode to render an action button alongside the input.
 * @param props.children - The input component to be wrapped.
 */
export function ArfInput({
  declensions,
  isEditing,
  inputDefinition,
  tooltip: tooltipOverride,
  noControl = false,
  noLabel = false,
  actionButton,
  children,
}: WrapperProps & {
  declensions: Declensions;
  isEditing: boolean;
  inputDefinition: FormInputBase;
  tooltip?: string | null;
  noControl?: boolean;
  noLabel?: boolean;
  actionButton?: ReactNode;
}) {
  const Comp = children == null ? Input : Slot;

  const isImmutableField = inputDefinition.immutable === true && isEditing;
  const tooltip =
    tooltipOverride === undefined
      ? isImmutableField
        ? INPUT_COMPONENT_MESSAGES.immutableFieldDisabled(declensions)
        : null
      : tooltipOverride;
  const input = (
    <Comp data-slot="input" disabled={isImmutableField}>
      {children}
    </Comp>
  );
  return (
    <FormItem>
      {noLabel ? null : <FormLabel>{inputDefinition.label}</FormLabel>}
      <div className="flex gap-2">
        <TooltipWrapper tooltip={tooltip}>
          <div className="grow">
            {noControl ? input : <FormControl>{input}</FormControl>}
          </div>
        </TooltipWrapper>
        {actionButton}
      </div>
      <FormMessage />
    </FormItem>
  );
}
