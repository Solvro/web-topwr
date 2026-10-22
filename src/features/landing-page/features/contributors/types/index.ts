import type { Resource } from "@/features/resources";
import type { ResourceDataWithRelations } from "@/features/resources/types";

export type Contributor = ResourceDataWithRelations<Resource.Contributors>;

export interface HoveredItemInfo {
  index: number;
  rowStart: number;
  rowEnd: number;
  x: number;
  y: number;
}

export interface AnimationTransforms {
  scale: number;
  translateY: number;
  translateX: number;
  zIndex: number;
}
