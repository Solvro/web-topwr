/* eslint-disable react/jsx-no-useless-fragment */
import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DetailField } from "@/types/calendar";

interface Props<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title?: string | ((data: T) => string);
  description?: string;
  fields: DetailField<T>[];
}

const defaultFormatter = (value: unknown): ReactNode => {
  if (value == null) {
    return null;
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return null;
};

export function AbstractDetailsModal<T>({
  isOpen,
  onOpenChange,
  data,
  title = "Szczegóły",
  description,
  fields,
}: Props<T>) {
  if (data == null) {
    return null;
  }

  const modalTitle = typeof title === "function" ? title(data) : title;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{modalTitle}</DialogTitle>
          {description != null && description.trim() !== "" && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((field) => {
            if (field.isVisible != null && !field.isVisible(data)) {
              return null;
            }

            const value = field.getValue(data);

            if (value == null && field.formatter == null) {
              return null;
            }

            const formatter = field.formatter ?? defaultFormatter;
            const formattedValue = formatter(value);

            if (formattedValue == null) {
              return null;
            }

            return (
              <div
                key={field.key}
                className={`space-y-2 ${field.className ?? ""}`}
              >
                <div className="flex text-sm font-medium text-gray-700">
                  {field.icon !== null && (
                    <span className="mr-1">{field.icon}</span>
                  )}
                  <>{field.label}</>
                </div>
                <div className="text-sm text-gray-600">{formattedValue}</div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
