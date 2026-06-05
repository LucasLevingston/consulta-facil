import { z } from "zod";
import { clinicWorkingHoursItemSchema } from "./clinic-working-hours-item.schema";

export const clinicWorkingHoursResponseSchema =
	clinicWorkingHoursItemSchema.extend({
		id: z.string(),
		clinicId: z.string(),
	});

export type ClinicWorkingHoursResponse = z.infer<
	typeof clinicWorkingHoursResponseSchema
>;
