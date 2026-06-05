import { z } from "zod";

export const createProfessionalSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	profession: z.string().min(2, "Profissão é obrigatória"),
	specialty: z
		.string()
		.min(3, "Especialidade deve ter pelo menos 3 caracteres")
		.max(100),
	licenseNumber: z
		.string()
		.min(5, "Número de registro deve ter pelo menos 5 caracteres")
		.max(50),
});

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;

// Backwards-compatible aliases
export const createDoctorSchema = createProfessionalSchema;
export type CreateDoctorInput = CreateProfessionalInput;
