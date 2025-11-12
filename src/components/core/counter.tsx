import { Badge } from "@/components/ui/badge";

export function Counter({
  values,
  label,
}: {
  values: unknown[];
  label: string;
}) {
  if (values.length === 0) {
    return null;
  }
  return (
    <Badge
      size="counter"
      className="absolute -top-2.5 left-full -ml-2.5"
      aria-label={label}
    >
      {values.length}
    </Badge>
  );
}
