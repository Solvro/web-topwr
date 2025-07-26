import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { SELECT_OPTION_LABELS } from "@/config/constants";
import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "@/config/enums";
import { enumToFormSelectOptions } from "@/lib/helpers";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";
import type { AbstractResourceFormInputs } from "@/types/forms";

const formInputs = {
  imageInputs: [
    {
      label: "Logo",
      name: "logoKey",
    },
    {
      label: "Baner",
      name: "coverKey",
    },
  ],

  textInputs: [
    {
      name: "name",
      label: "Nazwa",
    },
    {
      name: "shortDescription",
      label: "Krótki opis",
    },
  ],

  richTextInput: {
    name: "description",
    label: "Opis",
  },

  selectInputs: [
    {
      name: "departmentId",
      label: "Wydział",
      placeholder: "Wybierz wydział",
      options: enumToFormSelectOptions(
        DepartmentIds,
        SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.DEPARTMENT,
      ),
    },
    {
      name: "source",
      label: "Źródło",
      placeholder: "Wybierz źródło",
      options: enumToFormSelectOptions(
        OrganizationSource,
        SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.SOURCE,
      ),
    },
    {
      name: "organizationType",
      label: "Typ",
      placeholder: "Wybierz typ",
      options: enumToFormSelectOptions(
        OrganizationType,
        SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.TYPE,
      ),
    },
    {
      name: "organizationStatus",
      label: "Status",
      placeholder: "Wybierz status",
      options: enumToFormSelectOptions(
        OrganizationStatus,
        SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.STATUS,
      ),
    },
  ],
  checkboxInputs: [
    {
      name: "isStrategic",
      label: "Czy jest kołem strategicznym?",
    },
  ],
} satisfies AbstractResourceFormInputs<Resource.StudentOrganizations>;

export function Form({
  initialData,
}: {
  initialData?: ResourceDataType<Resource.StudentOrganizations> | null;
}) {
  const defaultValues:
    | ResourceFormValues<Resource.StudentOrganizations>
    | ResourceDataType<Resource.StudentOrganizations> = initialData ?? {
    name: "",
    departmentId: null,
    logoKey: null,
    coverKey: null,
    description: null,
    shortDescription: null,
    coverPreview: false, // pojęcia nie mam co to jest, te organizacje co są już w bazie mają to w 99% przypadków na false
    source: OrganizationSource.Manual,
    organizationType: OrganizationType.ScientificClub,
    organizationStatus: OrganizationStatus.Active,
    isStrategic: false,
  };

  return (
    <AbstractResourceForm
      resource={Resource.StudentOrganizations}
      defaultValues={defaultValues}
      formInputs={formInputs}
    />
  );
}
