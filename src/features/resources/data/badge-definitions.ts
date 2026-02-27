import type { ResourceBadgeDefinitions } from "@/features/abstract-resource-list/types";

import { Resource } from "../enums";

export const RESOURCE_BADGE_DEFINITIONS = {
  [Resource.StudentOrganizations]: {
    [Resource.Departments]: {
      displayField: "code",
      colorField: "gradientStop",
      link: true,
    },
    [Resource.StudentOrganizationTags]: {
      displayField: "tag",
    },
  },
  [Resource.Departments]: {
    [Resource.Majors]: {
      displayField: "name",
    },
  },
} satisfies {
  [R in Resource]?: ResourceBadgeDefinitions<R>;
};
