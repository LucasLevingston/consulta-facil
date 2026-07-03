import { z } from "zod";

import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { PROFESSIONAL_TYPE_LABELS } from "@/utils/constants/professional-types";

const professionValues = Object.keys(PROFESSIONAL_TYPE_LABELS) as [
	string,
	...string[],
];
const specialtyValues = Object.keys(SPECIALTY_LABELS) as [string, ...string[]];

export const createProfessionalSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	profession: z.enum(professionValues, {
		error: "Selecione uma profissão",
	}),
	specialty: z.enum(specialtyValues, {
		error: "Selecione uma especialidade",
	}),
	licenseNumber: z
		.string()
		.min(5, "Número de registro deve ter pelo menos 5 caracteres")
		.max(50, "Número de registro muito longo"),
});

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
