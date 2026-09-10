import { MAX_ITEM_SCALE, MAX_SCALE_DISTANCE } from "../constants";

export const getItemScale = (distance: number) => {
  if (distance >= MAX_SCALE_DISTANCE) {
    return 1;
  }
  const t = 1 - distance / MAX_SCALE_DISTANCE;
  return 1 + Math.sin((t * Math.PI) / 2) * (MAX_ITEM_SCALE - 1);
};
