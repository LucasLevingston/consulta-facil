import { z } from "zod";

export const createDependentSchema = z.object({
	name: z.string().min(2, "Nome obrigatório"),
	cpf: z
		.string()
		.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
		.optional()
		.or(z.literal("")),
	birthDate: z.string().optional(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
	relationship: z.enum(["CHILD", "SPOUSE", "SIBLING", "PARENT", "OTHER"]),
});

export type CreateDependentInput = z.infer<typeof createDependentSchema>;
