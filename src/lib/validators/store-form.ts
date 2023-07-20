import {z} from "zod";

export const CreateStoreFormScheme = z.object({
    name: z.string().min(3).max(255).regex(/^[a-zA-Z0-9_]+$/),
})

export type CreateStoreFormType = z.infer<typeof CreateStoreFormScheme>
