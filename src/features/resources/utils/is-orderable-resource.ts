import type { Resource } from "../enums";
import type { OrderableResource } from "../types/internal";
import { getResourceMetadata } from "./get-resource-metadata";

export const isOrderableResource = (
  resource: Resource,
): resource is OrderableResource =>
  getResourceMetadata(resource).orderable === true;
