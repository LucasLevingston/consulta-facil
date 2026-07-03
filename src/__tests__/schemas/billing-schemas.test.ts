import { describe, expect, it } from "vitest";
import { updateBillingSettingsSchema } from "@/lib/schemas/billing/billing-settings.schema";
import {
	createFeatureSchema,
	updateFeatureSchema,
} from "@/lib/schemas/billing/feature.schema";

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

describe("createFeatureSchema", () => {
	it("accepts valid data", () => {
		const result = createFeatureSchema.safeParse({
			key: "feature-key",
			name: "Feature Name",
		});
		expect(result.success).toBe(true);
	});
	it("accepts data with optional description", () => {
		const result = createFeatureSchema.safeParse({
			key: "feature-key",
			name: "Feature Name",
			description: "Desc",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing required fields", () => {
		expect(createFeatureSchema.safeParse({}).success).toBe(false);
	});
	it("rejects key too short (min 2)", () => {
		expect(
			createFeatureSchema.safeParse({ key: "f", name: "Feature" }).success,
		).toBe(false);
	});
	it("rejects name too short (min 2)", () => {
		expect(
			createFeatureSchema.safeParse({ key: "my-key", name: "F" }).success,
		).toBe(false);
	});
});

describe("updateFeatureSchema", () => {
	it("accepts empty object (all fields optional)", () => {
		expect(updateFeatureSchema.safeParse({}).success).toBe(true);
	});
	it("accepts valid name", () => {
		expect(updateFeatureSchema.safeParse({ name: "New Name" }).success).toBe(
			true,
		);
	});
	it("rejects name too short (min 2)", () => {
		expect(updateFeatureSchema.safeParse({ name: "N" }).success).toBe(false);
	});
});
