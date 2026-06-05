import { z } from "zod";
import { examRequestStatusSchema } from "./exam-request-status.schema";

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

export type ExamRequestResponse = z.infer<typeof examRequestResponseSchema>;
