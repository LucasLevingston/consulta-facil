import { describe, expect, it } from "vitest";
import { userResponseSchema, userRoleSchema } from "./user-response.schema";

describe("userRoleSchema", () => {
	it("accepts PATIENT", () => {
		expect(userRoleSchema.safeParse("PATIENT").success).toBe(true);
	});
	it("accepts PROFESSIONAL", () => {
		expect(userRoleSchema.safeParse("PROFESSIONAL").success).toBe(true);
	});
	it("accepts ADMIN", () => {
		expect(userRoleSchema.safeParse("ADMIN").success).toBe(true);
	});
	it("accepts RECEPTIONIST", () => {
		expect(userRoleSchema.safeParse("RECEPTIONIST").success).toBe(true);
	});
	it("rejects invalid role", () => {
		expect(userRoleSchema.safeParse("SUPERUSER").success).toBe(false);
	});
	it("rejects empty string", () => {
		expect(userRoleSchema.safeParse("").success).toBe(false);
	});
});

describe("userResponseSchema", () => {
	it("accepts minimal data (only id required)", () => {
		expect(userResponseSchema.safeParse({ id: "1" }).success).toBe(true);
	});
	it("accepts full valid data", () => {
		const result = userResponseSchema.safeParse({
			id: "1",
			name: "Alice",
			email: "alice@example.com",
			role: "PATIENT",
			phone: "+5511999999999",
			cpf: "123.456.789-00",
			birthDate: "1990-01-01",
			imageUrl: null,
			createdAt: "2024-01-01",
			updatedAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing id", () => {
		expect(userResponseSchema.safeParse({}).success).toBe(false);
	});
	it("rejects invalid role", () => {
		expect(
			userResponseSchema.safeParse({ id: "1", role: "INVALID" }).success,
		).toBe(false);
	});
});
