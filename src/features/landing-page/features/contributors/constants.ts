/** Contributor avatar width */
export const ITEM_BASE_WIDTH = 56;

/** Negative margin to overlap items (Tailwind -ml-4) */
export const ITEM_OVERLAP = 16;

/** Effective width per item (56 - 16) */
export const ITEM_EFFECTIVE_WIDTH = ITEM_BASE_WIDTH - ITEM_OVERLAP;

/** Maximum hover scale factor */
export const MAX_ITEM_SCALE = 1.3;

/** Distance threshold where scaling stops */
export const MAX_SCALE_DISTANCE = 1.5;

/** Minimum items per row to prevent awkward wrapping */
export const MIN_ITEMS_PER_ROW = 5;

/** Maximum Y translation for hovered items */
export const MAX_TRANSLATE_Y = 20;
