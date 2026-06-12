import { z } from "zod";

export const examRequestStatusSchema = z.enum([
	"PENDING",
	"SCHEDULED",
	"UPLOADED",
	"REVIEWED",
]);

export type ExamRequestStatus = z.infer<typeof examRequestStatusSchema>;
