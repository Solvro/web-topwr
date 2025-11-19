/** This is needed because sometimes React Hook Form reports a dirty form without any dirty fields. */
export const isFormStateDirty = (formState: {
  dirtyFields?: Partial<Record<string, unknown>>;
  isDirty?: boolean;
}) =>
  formState.isDirty === true &&
  Object.keys(formState.dirtyFields ?? {}).length > 0;
