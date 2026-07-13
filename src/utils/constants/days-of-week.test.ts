import { describe, expect, it } from "vitest";
import { DAYS } from "./days-of-week";

describe("DAYS", () => {
	it("has 7 days", () => {
		expect(DAYS).toHaveLength(7);
	});
	it("first key is MONDAY", () => {
		expect(DAYS[0].key).toBe("MONDAY");
	});
	it("last key is SUNDAY", () => {
		expect(DAYS[6].key).toBe("SUNDAY");
	});
	it("each item has key and label", () => {
		for (const d of DAYS) {
			expect(d.key).toBeDefined();
			expect(d.label).toBeDefined();
		}
	});
});
