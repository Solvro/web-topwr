import type { ResourcePk } from "@/features/resources/types";

import type { PermissionAction, User } from "../types/internal";

/**
 * Checks whether the user has been granted the given permission on the given backend model.
 * If `instanceId` is omitted, only model-wide permissions are considered.
 */
export function hasModelPermission(
  user: User | null,
  action: PermissionAction,
  modelName: string,
  instanceId?: ResourcePk,
): boolean {
  if (user == null) {
    return false;
  }
  return user.permissions.some(
    (permission) =>
      permission.action === action &&
      permission.modelName === modelName &&
      (permission.instanceId == null ||
        (instanceId != null &&
          String(permission.instanceId) === String(instanceId))),
  );
}
