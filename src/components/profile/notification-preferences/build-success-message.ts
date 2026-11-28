import type { UpdateNotificationPreferences } from "@/lib/schemas/user/notification-preferences.schema";

export function buildSuccessMessage(
	preferences: UpdateNotificationPreferences,
): string {
	if (preferences.whatsappNotificationsEnabled !== undefined) {
		return preferences.whatsappNotificationsEnabled
			? "Avisos pelo WhatsApp ativados."
			: "Avisos pelo WhatsApp desativados.";
	}
	if (preferences.emailNotificationsEnabled !== undefined) {
		return preferences.emailNotificationsEnabled
			? "Avisos por e-mail ativados."
			: "Avisos por e-mail desativados.";
	}
	return "Preferências salvas.";
}
