import { isEmptyValue } from "./is-empty-value";

export const isUnsetEnumField = (value: unknown): boolean =>
  isEmptyValue(value) || Number(value) < 0;
