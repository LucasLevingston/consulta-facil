import { describe, expect, it } from "vitest";
import { createFeatureSchema, updateFeatureSchema } from "./feature.schema";

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
