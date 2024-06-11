import { z } from "zod";

export const BillboardFormSchema = z.object({
  label: z.string().min(3),
  imageUrl: z.string(),
});

export type BillboardFormSchemaType = z.infer<typeof BillboardFormSchema>;
