import { describe, expect, it } from "vitest";
import { ALL_METHODS } from "@/utils/constants/payment-methods";

describe("ALL_METHODS (payment)", () => {
	it("is a non-empty array", () => {
		expect(ALL_METHODS.length).toBeGreaterThan(0);
	});
	it("contains PIX", () => {
		expect(ALL_METHODS).toContain("PIX");
	});
	it("contains CREDIT_CARD", () => {
		expect(ALL_METHODS).toContain("CREDIT_CARD");
	});
	it("contains CASH", () => {
		expect(ALL_METHODS).toContain("CASH");
	});
	it("has 5 methods", () => {
		expect(ALL_METHODS).toHaveLength(5);
	});
});
