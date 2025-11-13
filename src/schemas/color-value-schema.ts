import { z } from "zod";

export const ColorValueSchema = z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/);
