import { describe, expect, it } from "vitest";
import { updateNotificationPreferencesSchema } from "./notification-preferences.schema";

describe("updateNotificationPreferencesSchema", () => {
	it.each([true, false])("accepts whatsappNotificationsEnabled=%s", (value) => {
		expect(
			updateNotificationPreferencesSchema.safeParse({
				whatsappNotificationsEnabled: value,
			}).success,
		).toBe(true);
	});

	it("requires the flag", () => {
		expect(updateNotificationPreferencesSchema.safeParse({}).success).toBe(
			false,
		);
	});

	it("rejects non-boolean values", () => {
		expect(
			updateNotificationPreferencesSchema.safeParse({
				whatsappNotificationsEnabled: "false",
			}).success,
		).toBe(false);
	});
});
