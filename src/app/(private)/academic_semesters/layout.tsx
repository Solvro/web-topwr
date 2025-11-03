import { AbstractResourceLayout } from "@/components/abstract/resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/components";

export default function AcademicSemestersLayout(props: LayoutProps) {
  return (
    <AbstractResourceLayout resource={Resource.AcademicSemesters} {...props} />
  );
}
