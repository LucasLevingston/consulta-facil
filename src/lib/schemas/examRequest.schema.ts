import { z } from "zod";

export const examRequestStatusSchema = z.enum([
	"PENDING",
	"UPLOADED",
	"REVIEWED",
]);

export const examRequestResponseSchema = z.object({
	id: z.string(),
	appointmentId: z.string(),
	professionalId: z.string(),
	professionalName: z.string().nullable().optional(),
	patientId: z.string(),
	patientName: z.string().nullable().optional(),
	examName: z.string(),
	instructions: z.string().nullable().optional(),
	status: examRequestStatusSchema,
	fileUrl: z.string().nullable().optional(),
	fileName: z.string().nullable().optional(),
	professionalNotes: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

export const createExamRequestSchema = z.object({
	examName: z.string().min(1, "Nome do exame é obrigatório"),
	instructions: z.string().max(1000).optional(),
});

export const reviewExamRequestSchema = z.object({
	professionalNotes: z
		.string()
		.min(1, "Observações são obrigatórias")
		.max(2000),
});

export type ExamRequestStatus = z.infer<typeof examRequestStatusSchema>;
export type ExamRequestResponse = z.infer<typeof examRequestResponseSchema>;
export type CreateExamRequestInput = z.infer<typeof createExamRequestSchema>;
export type ReviewExamRequestInput = z.infer<typeof reviewExamRequestSchema>;
