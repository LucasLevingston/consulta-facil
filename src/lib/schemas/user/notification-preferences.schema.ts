import { z } from "zod";

export const updateNotificationPreferencesSchema = z.object({
	whatsappNotificationsEnabled: z.boolean(),
});
export type UpdateNotificationPreferences = z.infer<
	typeof updateNotificationPreferencesSchema
>;
