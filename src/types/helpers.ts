export interface Pluralized<T extends Record<string, unknown>> {
  singular: T;
  plural: { [K in keyof T]: T[K] };
}

export type Defined<T> = Exclude<T, undefined>;

export type ValueOf<T> = T[keyof T];

/**
 * A record which must contain all keys from type K and all keys from type J.
 * Useful when combining a record of a specific type and a record of strings,
 * which prevents the string keys from absorbing the specific type keys
 * due to them being more generic.
 */
export type RecordIntersection<
  K extends string | number | symbol,
  J extends string | number | symbol,
  V,
> = Record<K, V> & Record<J, V>;

export type OptionalPromise<T> = T | Promise<T>;
