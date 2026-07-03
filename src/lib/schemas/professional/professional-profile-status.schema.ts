import { z } from "zod";

export const professionalProfileStatusSchema = z.enum([
	"PENDING_REVIEW",
	"ACTIVE",
	"REJECTED",
]);

export type ProfessionalProfileStatus = z.infer<
	typeof professionalProfileStatusSchema
>;
