import { describe, expect, it } from "vitest";
import { formatBRL } from "./format-brl";

describe("formatBRL", () => {
	it("formats zero", () => {
		expect(formatBRL(0)).toContain("0");
	});

	it("formats positive integer", () => {
		const result = formatBRL(100);
		expect(result).toContain("100");
		expect(result).toContain("R$");
	});

	it("formats decimal value", () => {
		const result = formatBRL(1234.56);
		expect(result).toContain("1");
		expect(result).toContain("234");
	});

	it("returns string", () => {
		expect(typeof formatBRL(50)).toBe("string");
	});

	it("includes currency symbol", () => {
		expect(formatBRL(10)).toMatch(/R\$/);
	});

	it("formats 9.99", () => {
		expect(formatBRL(9.99)).toMatch(/9,99/);
	});
});
