import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditAcademicSemestersPage(
  props: ResourceEditPageProps,
) {
  return (
    <AbstractResourceEditPage
      resource={Resource.AcademicSemesters}
      {...props}
    />
  );
}
