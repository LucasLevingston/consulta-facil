import { z } from "zod";

export const DoctorFormValidation = z.object({
	name: z.string().min(1, "Nome é obrigatório."),
	email: z.string().email("Endereço de e-mail inválido."),
	phone: z
		.string()
		.min(10, "Número de telefone deve ter pelo menos 10 caracteres."),
	imageProfile: z.union([z.custom<File[]>(), z.string()]).optional(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]),
	birthDate: z.date(),
	cpf: z.string().min(1, "CPF é obrigatório."),
	address: z
		.string()
		.min(5, "Deve ter pelo menos 5 caracteres")
		.max(500, "Não pode ter mais que 500 caracteres"),
	profession: z.string().min(1, "Profissão é obrigatória."),
	specialty: z.string().min(1, "Especialidade é obrigatório."),
	licenseNumber: z.string().min(1, "Número de licença é obrigatório."),
	identificationDocumentType: z.string(),
	identificationDocument: z.union([z.custom<File[]>(), z.string()]).optional(),
	privacyConsent: z.boolean().refine((val) => val === true, {
		message: "Você deve consentir com a política de privacidade.",
	}),
});
