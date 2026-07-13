import { describe, expect, it } from "vitest";
import { updateBillingSettingsSchema } from "./billing-settings.schema";

describe("updateBillingSettingsSchema", () => {
	it("accepts empty object (all fields optional)", () => {
		expect(updateBillingSettingsSchema.safeParse({}).success).toBe(true);
	});
	it("accepts valid full data", () => {
		const result = updateBillingSettingsSchema.safeParse({
			defaultCurrency: "BRL",
			defaultGateway: "stripe",
			pixExpirationMinutes: 30,
			invoiceExpirationDays: 7,
			defaultTrialDays: 14,
		});
		expect(result.success).toBe(true);
	});
	it("rejects currency with wrong length", () => {
		expect(
			updateBillingSettingsSchema.safeParse({ defaultCurrency: "US" }).success,
		).toBe(false);
	});
	it("rejects non-positive pixExpirationMinutes", () => {
		expect(
			updateBillingSettingsSchema.safeParse({ pixExpirationMinutes: 0 })
				.success,
		).toBe(false);
	});
	it("rejects negative defaultTrialDays", () => {
		expect(
			updateBillingSettingsSchema.safeParse({ defaultTrialDays: -1 }).success,
		).toBe(false);
	});
});
