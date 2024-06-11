import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().min(3),
  billboardId: z.string().min(1),
});

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
