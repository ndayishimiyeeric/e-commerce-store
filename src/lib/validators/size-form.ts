import { z } from "zod";

export const SizeFormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export type SizeFormSchemaType = z.infer<typeof SizeFormSchema>;
