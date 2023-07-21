import {z} from "zod";

export const ColorFormSchema = z.object({
    name: z.string().min(3),
    value: z.string().min(4).regex(/^#([0-9a-f]{3}){1,2}$/i, {
        message: 'Enter a CSS color code starting with "#" and followed by 3 or 6 characters. Use digits (0-9) or lowercase letters (a-f). Example: #abc or #1a2b3c.'
    }),
})

export type ColorFormSchemaType = z.infer<typeof ColorFormSchema>
