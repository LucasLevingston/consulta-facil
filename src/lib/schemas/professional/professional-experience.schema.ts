import { z } from "zod";

export const professionalExperienceSchema = z.object({
	position: z.string().min(1, "Cargo obrigatório"),
	institution: z.string().min(1, "Instituição obrigatória"),
	startYear: z.number().min(1900, "Ano inválido"),
	endYear: z.number().min(1900).nullable().optional(),
	description: z.string().max(500).nullable().optional(),
});

export type ProfessionalExperienceInput = z.infer<
	typeof professionalExperienceSchema
>;
