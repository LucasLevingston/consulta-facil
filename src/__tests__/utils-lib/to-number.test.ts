import { describe, expect, it } from "vitest";
import { toNumber } from "@/utils/to-number";

describe("toNumber", () => {
	it("null → null", () => expect(toNumber(null)).toBeNull());
	it("undefined → null", () => expect(toNumber(undefined)).toBeNull());
	it("empty string → null", () => expect(toNumber("")).toBeNull());
	it("NaN string → null", () => expect(toNumber("abc")).toBeNull());

	it("numeric string → number", () => expect(toNumber("42")).toBe(42));
	it("number passthrough", () => expect(toNumber(7)).toBe(7));
	it("zero → 0", () => expect(toNumber(0)).toBe(0));
	it("float string → float", () => expect(toNumber("3.14")).toBeCloseTo(3.14));
	it("negative → negative", () => expect(toNumber("-5")).toBe(-5));
});
