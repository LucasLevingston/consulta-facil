import { z } from "zod";

export const professionalCertificateSchema = z.object({
	title: z.string().min(1, "Título obrigatório"),
	issuingOrganization: z.string().nullable().optional(),
	issueYear: z.number().min(1900).max(2100).nullable().optional(),
	certificateUrl: z
		.string()
		.nullable()
		.optional()
		.refine((v) => !v || v.startsWith("http://") || v.startsWith("https://"), {
			message: "Informe uma URL válida",
		}),
});

export type ProfessionalCertificateInput = z.infer<
	typeof professionalCertificateSchema
>;
