import type { Path } from "react-hook-form";
import type { z } from "zod";

export type AppSchema = z.ZodObject<z.ZodRawShape>;

/**
 * Extracts the base Zod type by unwrapping Nullable, Default, and Optional wrappers.
 * @example type Base = BaseZodType<z.ZodNullable<z.ZodString>> // yields ZodString
 */
type BaseZodType<T extends z.ZodTypeAny> = T extends
  | z.ZodNullable<infer U>
  | z.ZodDefault<infer U>
  | z.ZodOptional<infer U>
  ? BaseZodType<U>
  : T;

/**
 * Resolves the Zod type located at path P in schema S, included recursively nested paths.
 * @example type NotificationTitle = ResolvePath<ResourceSchema<Resource.Notifications>, "notification.title"> // yields ZodString
 */
export type ResolvePath<
  S extends AppSchema,
  P extends Path<z.infer<S>>,
> = P extends `${infer K}.${infer V}`
  ? K extends keyof S["shape"]
    ? S["shape"][K] extends AppSchema
      ? V extends Path<z.infer<S["shape"][K]>>
        ? ResolvePath<S["shape"][K], V>
        : never
      : never
    : never
  : P extends keyof S["shape"]
    ? S["shape"][P]
    : never;

/**
 * Extracts all path values of schema S, such that the schema type of the value at that path extends Y.
 * @param S - Zod schema object to extract paths from
 * @param Y - Zod type to filter paths by (defaults to ZodString)
 * @example type StringPaths = TypedSchemaKey<ResourceSchema<Resource.Notifications>> // yields 'notification.title' | 'notification.body' | `topics.${number}`
 * @example type BooleanPaths = TypedSchemaKey<ResourceSchema<Resource.StudentOrganizations>, z.ZodBoolean> // yields 'coverPreview' | 'isStrategic'
 */
export type TypedSchemaKey<
  S extends AppSchema,
  Y extends z.ZodTypeAny = z.ZodString,
> = {
  [P in Path<z.infer<S>>]: BaseZodType<ResolvePath<S, P>> extends Y ? P : never;
}[Path<z.infer<S>>];
