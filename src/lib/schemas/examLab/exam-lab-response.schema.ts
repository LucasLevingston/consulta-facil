import { z } from "zod";

export const examLabHoursEntrySchema = z.object({
	id: z.string(),
	dayOfWeek: z.string(),
	openTime: z.string(),
	closeTime: z.string(),
	slotDurationMinutes: z.number(),
	isOpen: z.boolean(),
});

export const examLabResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	acceptedExams: z.array(z.string()).optional().default([]),
	status: z.string(),
	hours: z.array(examLabHoursEntrySchema).optional().default([]),
	createdAt: z.string().nullable().optional(),
});

export type ExamLabResponse = z.infer<typeof examLabResponseSchema>;
export type ExamLabHoursEntry = z.infer<typeof examLabHoursEntrySchema>;
