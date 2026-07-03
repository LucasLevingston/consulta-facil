import { z } from "zod";

export { DOCUMENT_TYPE_LABELS } from "./constants";

export const documentTypeSchema = z.enum([
	"CPF",
	"RG",
	"CNH",
	"HEALTH_CARD",
	"INSURANCE_CARD",
	"OTHER",
]);

export type DocumentType = z.infer<typeof documentTypeSchema>;

export const patientDocumentResponseSchema = z.object({
	id: z.string(),
	documentType: documentTypeSchema,
	documentLabel: z.string().nullable().optional(),
	fileUrl: z.string(),
	fileName: z.string().nullable().optional(),
	uploadedAt: z.string().nullable().optional(),
});

export type PatientDocumentResponse = z.infer<
	typeof patientDocumentResponseSchema
>;
