import { describe, expect, it } from "vitest";
import { RADIUS_OPTIONS } from "./radius-options";

describe("RADIUS_OPTIONS", () => {
	it("has 4 options", () => {
		expect(RADIUS_OPTIONS).toHaveLength(4);
	});
	it("first option value is '10'", () => {
		expect(RADIUS_OPTIONS[0].value).toBe("10");
	});
	it("last option value is '100'", () => {
		expect(RADIUS_OPTIONS[3].value).toBe("100");
	});
	it("each option has value and label", () => {
		for (const opt of RADIUS_OPTIONS) {
			expect(opt.value).toBeDefined();
			expect(opt.label).toBeDefined();
		}
	});
});
