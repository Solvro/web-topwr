export const SOLVRO_ADMINS_ONLY = ["solvro_admin"] as const;
export const ADMINS_ONLY = ["admin", ...SOLVRO_ADMINS_ONLY] as const;
export const ANY_AUTHENTICATED_ROLE = ["user", ...ADMINS_ONLY] as const;
