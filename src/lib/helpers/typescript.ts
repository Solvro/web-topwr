export function isKeyOf<T extends object, K extends string | number | symbol>(
  key: K,
  parentObject: T,
): key is K & keyof T {
  return key in parentObject;
}

export function typedEntries<T extends Record<string, unknown> | unknown[]>(
  targetObject: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(targetObject) as [keyof T, T[keyof T]][];
}
