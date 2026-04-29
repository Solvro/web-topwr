import type { Path } from "react-hook-form";
import type { z } from "zod";

export type AppSchema = z.ZodObject<z.ZodRawShape> | z.ZodEffects<z.ZodTypeAny>;

/**
 * Extracts the ZodObject from an AppSchema, even if it is wrapped in ZodEffects.
 */
type GetObject<S extends z.ZodTypeAny> =
  S extends z.ZodObject<z.ZodRawShape>
    ? S
    : S extends z.ZodEffects<infer U>
      ? GetObject<U>
      : never;

/**
 * Extracts the base Zod type by unwrapping Nullable, Default, and Optional wrappers.
 * @example type Base = BaseZodType<z.ZodNullable<z.ZodString>> // yields ZodString
 */
type BaseZodType<T extends z.ZodTypeAny> = T extends
  | z.ZodNullable<infer U>
  | z.ZodDefault<infer U>
  | z.ZodOptional<infer U>
  // this assumes all unions can reasonably be represented by the type of their first constituent - works for now
  | z.ZodUnion<[infer U, ...z.ZodTypeAny[]]>
  ? BaseZodType<U>
  : T;

/**
 * Resolves the Zod type located at path P in schema S, included recursively nested paths.
 * @example type NotificationTitle = ResolvePath<ResourceSchema<Resource.Notifications>, "notification.title"> // yields ZodString
 */
type ResolvePath<S extends AppSchema, P extends Path<z.infer<S>>> =
  GetObject<S> extends z.ZodObject<infer Shape>
    ? P extends `${infer K}.${infer V}`
      ? K extends keyof Shape
        ? Shape[K] extends AppSchema
          ? V extends Path<z.infer<Shape[K]>>
            ? ResolvePath<Shape[K], V>
            : never
          : never
        : never
      : P extends keyof Shape
        ? Shape[P]
        : never
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
