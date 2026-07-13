import { describe, expect, it } from "vitest";
import { getPlaceholderByFormName } from "./get-placeholder-by-form-name";

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

	it("email → exact placeholder", () => {
		expect(getPlaceholderByFormName("email")).toBe("seu@exemplo.com");
	});

	it("phone → exact placeholder", () => {
		expect(getPlaceholderByFormName("phone")).toBe("(11) 99999-9999");
	});

	it("cpf → exact placeholder", () => {
		expect(getPlaceholderByFormName("cpf")).toBe("000.000.000-00");
	});

	it("password → exact placeholder", () => {
		expect(getPlaceholderByFormName("password")).toBe("••••••");
	});

	it("specialty → empty string (no placeholder mapped)", () => {
		expect(getPlaceholderByFormName("specialty")).toBe("");
	});
});
