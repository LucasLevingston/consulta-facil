import { z } from "zod";

export const dependentResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	cpf: z.string().nullable().optional(),
	birthDate: z.string().nullable().optional(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
	relationship: z.enum(["CHILD", "SPOUSE", "SIBLING", "PARENT", "OTHER"]),
	createdAt: z.string().nullable().optional(),
});

export type DependentResponse = z.infer<typeof dependentResponseSchema>;
