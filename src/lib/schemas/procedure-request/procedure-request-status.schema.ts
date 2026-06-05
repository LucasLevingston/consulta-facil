import { z } from "zod";

export const procedureRequestStatusSchema = z.enum([
	"PENDING",
	"SCHEDULED",
	"COMPLETED",
	"CANCELED",
]);

export type ProcedureRequestStatus = z.infer<
	typeof procedureRequestStatusSchema
>;
