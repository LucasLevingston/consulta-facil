import { describe, expect, it } from "vitest";
import { dependentResponseSchema } from "@/lib/schemas/dependent/dependent-response.schema";

describe("dependentResponseSchema", () => {
	it("accepts valid minimal data", () => {
		const result = dependentResponseSchema.safeParse({
			id: "1",
			name: "Child",
			relationship: "CHILD",
		});
		expect(result.success).toBe(true);
	});
	it("accepts full data with optional fields", () => {
		const result = dependentResponseSchema.safeParse({
			id: "1",
			name: "Child",
			cpf: "123.456.789-00",
			birthDate: "2010-01-01",
			gender: "MALE",
			relationship: "SPOUSE",
			createdAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing id", () => {
		expect(
			dependentResponseSchema.safeParse({
				name: "Child",
				relationship: "CHILD",
			}).success,
		).toBe(false);
	});
	it("rejects missing name", () => {
		expect(
			dependentResponseSchema.safeParse({ id: "1", relationship: "CHILD" })
				.success,
		).toBe(false);
	});
	it("rejects invalid relationship", () => {
		expect(
			dependentResponseSchema.safeParse({
				id: "1",
				name: "Child",
				relationship: "FRIEND",
			}).success,
		).toBe(false);
	});
	it("rejects invalid gender", () => {
		expect(
			dependentResponseSchema.safeParse({
				id: "1",
				name: "Child",
				relationship: "CHILD",
				gender: "UNKNOWN",
			}).success,
		).toBe(false);
	});
});
