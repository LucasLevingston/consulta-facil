import { z } from "zod";

export const examSchedulingResponseSchema = z.object({
	id: z.string(),
	examRequestId: z.string(),
	examName: z.string().nullable().optional(),
	examLabId: z.string(),
	examLabName: z.string().nullable().optional(),
	examLabAddress: z.string().nullable().optional(),
	examLabCity: z.string().nullable().optional(),
	examLabPhone: z.string().nullable().optional(),
	scheduledDate: z.string(),
	scheduledTime: z.string(),
	status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]),
	notes: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
});

export type ExamSchedulingResponse = z.infer<
	typeof examSchedulingResponseSchema
>;
