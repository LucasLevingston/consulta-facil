import { z } from "zod";

export const examRequestStatusSchema = z.enum([
	"PENDING",
	"UPLOADED",
	"REVIEWED",
]);

export type ExamRequestStatus = z.infer<typeof examRequestStatusSchema>;
