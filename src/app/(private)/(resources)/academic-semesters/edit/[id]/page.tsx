import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditAcademicSemesterPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage
      resource={Resource.AcademicSemesters}
      {...props}
    />
  );
}
