import { z } from "zod";

export const emailSchema = z.object({
	email: z.string().email("E-mail inválido"),
});

export type EmailInput = z.infer<typeof emailSchema>;
