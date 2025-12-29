import type { ResourceBadgeDefinitions } from "@/features/abstract-resource-list/types";

import { Resource } from "../enums";

export const RESOURCE_BADGE_DEFINITIONS = {
  [Resource.StudentOrganizations]: {
    [Resource.Departments]: {
      displayField: "code",
      colorField: "gradientStop",
    },
    [Resource.StudentOrganizationTags]: {
      displayField: "tag",
    },
  },
} satisfies {
  [R in Resource]?: ResourceBadgeDefinitions<R>;
};
