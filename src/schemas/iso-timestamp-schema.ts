import { z } from "zod";

export const IsoTimestampSchema = z.string().datetime({ offset: true });
