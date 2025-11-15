/** Used to unwrap the error object's message in a try-catch block. */
export const parseError = (error: unknown): { error: string } => ({
  error: error instanceof Error ? error.message : String(error),
});
