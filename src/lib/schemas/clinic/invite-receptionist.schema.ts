import { z } from "zod";

export const inviteReceptionistSchema = z.object({
	email: z.string().email("E-mail inválido"),
});

export type InviteReceptionistInput = z.infer<typeof inviteReceptionistSchema>;
