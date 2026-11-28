import { z } from "zod";

export const updateNotificationPreferencesSchema = z.object({
	whatsappNotificationsEnabled: z.boolean().optional(),
	emailNotificationsEnabled: z.boolean().optional(),
});
export type UpdateNotificationPreferences = z.infer<
	typeof updateNotificationPreferencesSchema
>;
