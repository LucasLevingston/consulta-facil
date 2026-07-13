import { describe, expect, it } from "vitest";
import { UserFormValidation } from "./user-form-validation";

describe("UserFormValidation", () => {
	const valid = {
		name: "João",
		email: "joao@email.com",
		password: "senha123",
		phone: "11999999999",
		role: "patient" as const,
	};

	it("valid data passes", () => {
		expect(UserFormValidation.safeParse(valid).success).toBe(true);
	});

	it("empty name fails", () => {
		expect(UserFormValidation.safeParse({ ...valid, name: "" }).success).toBe(
			false,
		);
	});

	it("invalid email fails", () => {
		expect(
			UserFormValidation.safeParse({ ...valid, email: "bad" }).success,
		).toBe(false);
	});

	it("short password fails", () => {
		expect(
			UserFormValidation.safeParse({ ...valid, password: "abc" }).success,
		).toBe(false);
	});

	it("invalid role fails", () => {
		expect(
			UserFormValidation.safeParse({ ...valid, role: "admin" as never })
				.success,
		).toBe(false);
	});
});
