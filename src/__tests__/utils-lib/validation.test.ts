import { describe, expect, it } from "vitest";
import { LoginFormValidation } from "@/lib/schemas/login-form-validation";
import { UserFormValidation } from "@/lib/user-form-validation";

describe("LoginFormValidation", () => {
	it("valid credentials pass", () => {
		const result = LoginFormValidation.safeParse({
			email: "user@email.com",
			password: "pass123",
		});
		expect(result.success).toBe(true);
	});

	it("invalid email fails", () => {
		const result = LoginFormValidation.safeParse({
			email: "not-an-email",
			password: "pass123",
		});
		expect(result.success).toBe(false);
	});

	it("empty password fails", () => {
		const result = LoginFormValidation.safeParse({
			email: "user@email.com",
			password: "",
		});
		expect(result.success).toBe(false);
	});
});

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
