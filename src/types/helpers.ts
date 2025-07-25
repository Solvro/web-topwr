import type { z } from "zod";

export type StringSubrecord<T> = {
  [K in keyof T & string]?: T[K] extends string | undefined ? T[K] : never;
};

export type WithOptionalId<T> = T & { id?: number };
export type SchemaWithOptionalId<T extends z.ZodType> = WithOptionalId<
  z.infer<T>
>;
