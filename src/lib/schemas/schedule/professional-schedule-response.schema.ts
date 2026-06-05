import { z } from "zod";
import { professionalScheduleItemSchema } from "./professional-schedule-item.schema";

export const professionalScheduleResponseSchema =
	professionalScheduleItemSchema.extend({
		id: z.string(),
		professionalProfileId: z.string(),
	});

export type ProfessionalScheduleResponse = z.infer<
	typeof professionalScheduleResponseSchema
>;
