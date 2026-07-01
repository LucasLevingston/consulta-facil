import { z } from "zod";
import {
	professionalTypeSchema,
	specialtySchema,
} from "@/features/professionals";

export const becomeProfessionalSchema = z.object({
	profession: professionalTypeSchema,
	specialty: specialtySchema,
	licenseNumber: z
		.string()
		.min(5, "Número de registro deve ter pelo menos 5 caracteres")
		.max(50, "Número de registro muito longo"),
});

export type BecomeProfessionalValues = z.infer<typeof becomeProfessionalSchema>;
