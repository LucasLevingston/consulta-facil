import { describe, expect, it } from "vitest";
import { getPlaceholderByFormName } from "@/lib/utils/get-placeholder-by-form-name";

describe("getPlaceholderByFormName", () => {
	it("email → placeholder with @", () => {
		expect(getPlaceholderByFormName("email")).toContain("@");
	});

	it("password → masked placeholder", () => {
		expect(getPlaceholderByFormName("password")).toContain("•");
	});

	it("confirmPassword → masked placeholder", () => {
		expect(getPlaceholderByFormName("confirmPassword")).toContain("•");
	});

	it("name → digit name placeholder", () => {
		const result = getPlaceholderByFormName("name");
		expect(result.length).toBeGreaterThan(0);
	});

	it("phone → phone format", () => {
		expect(getPlaceholderByFormName("phone")).toContain("(");
	});

	it("cpf → cpf format", () => {
		expect(getPlaceholderByFormName("cpf")).toContain(".");
	});

	it("unknown field → empty string", () => {
		expect(getPlaceholderByFormName("unknownField")).toBe("");
	});
});
