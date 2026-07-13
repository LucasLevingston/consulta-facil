import { describe, expect, it } from "vitest";
import { IdentificationTypes } from "./identification-types";

describe("IdentificationTypes", () => {
	it("is non-empty array", () =>
		expect(IdentificationTypes.length).toBeGreaterThan(0));
	it("all items are strings", () => {
		for (const item of IdentificationTypes) {
			expect(typeof item).toBe("string");
		}
	});
});
