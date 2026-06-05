import { z } from "zod";

export const resetPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, "Senha deve ter pelo menos 8 caracteres")
			.max(256),
		confirmPassword: z
			.string()
			.min(8, "Senha deve ter pelo menos 8 caracteres")
			.max(256),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "As senhas não conferem",
		path: ["confirmPassword"],
	});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
