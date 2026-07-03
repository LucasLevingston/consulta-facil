import { z } from "zod";

export const degreeTypeOptions = [
	{ value: "GRADUATION", label: "Graduação" },
	{ value: "SPECIALIZATION", label: "Especialização" },
	{ value: "MASTER", label: "Mestrado" },
	{ value: "PHD", label: "Doutorado" },
	{ value: "OTHER", label: "Outro" },
] as const;

export const professionalEducationSchema = z.object({
	degree: z.string().min(1, "Grau obrigatório"),
	institution: z.string().min(1, "Instituição obrigatória"),
	fieldOfStudy: z.string().nullable().optional(),
	graduationYear: z.number().min(1900).max(2100).nullable().optional(),
});

export type ProfessionalEducationInput = z.infer<
	typeof professionalEducationSchema
>;
