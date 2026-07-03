import { describe, expect, it } from "vitest";
import { toNumber } from "@/utils/to-number";

describe("toNumber", () => {
	it("converts '42' to 42", () => {
		expect(toNumber("42")).toBe(42);
	});
	it("passes through a number", () => {
		expect(toNumber(3.14)).toBe(3.14);
	});
	it("null → null", () => {
		expect(toNumber(null)).toBeNull();
	});
	it("undefined → null", () => {
		expect(toNumber(undefined)).toBeNull();
	});
	it("'' → null", () => {
		expect(toNumber("")).toBeNull();
	});
	it("'abc' → null", () => {
		expect(toNumber("abc")).toBeNull();
	});
	it("'0' → 0", () => {
		expect(toNumber("0")).toBe(0);
	});
});
