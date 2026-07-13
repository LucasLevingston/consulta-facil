import { describe, expect, it } from "vitest";
import { createDependentSchema } from "./create-dependent.schema";

describe("createDependentSchema", () => {
	it("accepts valid data", () => {
		const result = createDependentSchema.safeParse({
			name: "Child Name",
			relationship: "CHILD",
		});
		expect(result.success).toBe(true);
	});
	it("accepts empty string cpf (alternative to optional)", () => {
		const result = createDependentSchema.safeParse({
			name: "Child Name",
			relationship: "SPOUSE",
			cpf: "",
		});
		expect(result.success).toBe(true);
	});
	it("accepts valid formatted cpf", () => {
		const result = createDependentSchema.safeParse({
			name: "Child Name",
			relationship: "PARENT",
			cpf: "123.456.789-00",
		});
		expect(result.success).toBe(true);
	});
	it("rejects name too short (min 2)", () => {
		expect(
			createDependentSchema.safeParse({ name: "A", relationship: "CHILD" })
				.success,
		).toBe(false);
	});
	it("rejects invalid cpf format", () => {
		expect(
			createDependentSchema.safeParse({
				name: "Child Name",
				relationship: "CHILD",
				cpf: "12345678900",
			}).success,
		).toBe(false);
	});
	it("rejects missing relationship", () => {
		expect(
			createDependentSchema.safeParse({ name: "Child Name" }).success,
		).toBe(false);
	});
	it("rejects invalid relationship value", () => {
		expect(
			createDependentSchema.safeParse({
				name: "Child Name",
				relationship: "FRIEND",
			}).success,
		).toBe(false);
	});
});
