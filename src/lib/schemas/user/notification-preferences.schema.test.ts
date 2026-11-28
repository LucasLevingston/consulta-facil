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

	it.each([true, false])("accepts emailNotificationsEnabled=%s", (value) => {
		expect(
			updateNotificationPreferencesSchema.safeParse({
				emailNotificationsEnabled: value,
			}).success,
		).toBe(true);
	});

	it("accepts an empty object (all fields are optional)", () => {
		expect(updateNotificationPreferencesSchema.safeParse({}).success).toBe(
			true,
		);
	});

	it("rejects non-boolean values for whatsappNotificationsEnabled", () => {
		expect(
			updateNotificationPreferencesSchema.safeParse({
				whatsappNotificationsEnabled: "false",
			}).success,
		).toBe(false);
	});

	it("rejects non-boolean values for emailNotificationsEnabled", () => {
		expect(
			updateNotificationPreferencesSchema.safeParse({
				emailNotificationsEnabled: "true",
			}).success,
		).toBe(false);
	});
});
