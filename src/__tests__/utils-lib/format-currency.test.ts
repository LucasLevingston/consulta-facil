import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/utils/format-currency";

describe("formatCurrency", () => {
	it("formats zero", () => {
		expect(formatCurrency(0)).toContain("0");
	});

	it("formats positive value with BRL symbol", () => {
		const result = formatCurrency(100);
		expect(result).toMatch(/R\$/);
		expect(result).toContain("100");
	});

	it("formats decimal", () => {
		const result = formatCurrency(9.99);
		expect(result).toContain("9");
		expect(result).toContain("99");
	});

	it("returns string", () => {
		expect(typeof formatCurrency(50)).toBe("string");
	});
});
