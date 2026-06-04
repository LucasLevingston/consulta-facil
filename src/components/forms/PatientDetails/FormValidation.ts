import { z } from "zod";

export const PatientFormValidation = z.object({
	name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50),
	email: z.string().email("Endereço de e-mail inválido"),
	phone: z.string().min(1, "Telefone é obrigatório"),
	birthDate: z.date(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]),
	address: z
		.string()
		.min(5, "Endereço deve ter pelo menos 5 caracteres")
		.max(500),
	occupation: z
		.string()
		.min(2, "Ocupação deve ter pelo menos 2 caracteres")
		.max(500),
	emergencyContactName: z
		.string()
		.min(2, "Nome deve ter pelo menos 2 caracteres")
		.max(50),
	emergencyContactNumber: z.string(),
	allergies: z.string(),
	currentMedication: z.string(),
	familyMedicalHistory: z.string(),
	pastMedicalHistory: z.string(),
	identificationDocumentType: z.string(),
	cpf: z
		.string()
		.transform((val) => val.replace(/\D/g, ""))
		.pipe(z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos")),
	identificationDocument: z.custom<File[]>().optional(),
	imageProfile: z.custom<File[]>().optional(),
	treatmentConsent: z.boolean(),
	disclosureConsent: z.boolean(),
	privacyConsent: z.boolean(),
});
