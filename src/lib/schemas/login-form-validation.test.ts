import { describe, expect, it } from "vitest";
import { LoginFormValidation } from "./login-form-validation";

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
