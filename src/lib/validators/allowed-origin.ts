import { z } from "zod";

export const AllowedOriginSchema = z.object({
  origin: z.string().url(),
});

export type AllowedOriginType = z.infer<typeof AllowedOriginSchema>;
