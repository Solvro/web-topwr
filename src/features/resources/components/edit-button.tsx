import { SquarePen } from "lucide-react";

import { Link } from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { ADMIN_PATH } from "@/config/constants";
import { sanitizeId } from "@/utils";

import type { EditableResource, ResourcePk } from "../types/internal";
import { getEditButtonProps } from "../utils/get-edit-button-props";

export function EditButton({
  resource,
  id,
}: {
  resource: EditableResource;
  id: ResourcePk;
}) {
  return (
    <Button asChild {...getEditButtonProps(resource)}>
      <Link href={`${ADMIN_PATH}/${resource}/edit/${sanitizeId(id)}`}>
        <SquarePen />
      </Link>
    </Button>
  );
}
