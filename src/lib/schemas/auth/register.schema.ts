import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(150),
	email: z.string().email("E-mail inválido"),
	password: z
		.string()
		.min(8, "Senha deve ter pelo menos 8 caracteres")
		.max(256),
	confirmPassword: z
		.string()
		.min(8, "Senha deve ter pelo menos 8 caracteres")
		.max(256),
	cpf: z
		.string()
		.transform((val) => val.replace(/\D/g, ""))
		.pipe(
			z
				.string()
				.regex(/^\d{11}$/, "CPF deve conter 11 dígitos")
				.or(z.literal("")),
		),
	phone: z.string().optional().nullable(),
	birthDate: z.string().optional().nullable(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
