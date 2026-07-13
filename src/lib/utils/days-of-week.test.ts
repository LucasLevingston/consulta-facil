import { describe, expect, it } from "vitest";
import { daysOfWeek } from "./days-of-week";

describe("daysOfWeek", () => {
	it("0 → SUNDAY", () => {
		expect(daysOfWeek[0]).toBe("SUNDAY");
	});
	it("1 → MONDAY", () => {
		expect(daysOfWeek[1]).toBe("MONDAY");
	});
	it("6 → SATURDAY", () => {
		expect(daysOfWeek[6]).toBe("SATURDAY");
	});
});
