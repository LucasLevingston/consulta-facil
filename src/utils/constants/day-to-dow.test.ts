import { describe, expect, it } from "vitest";
import { JS_DAY_TO_DOW } from "./day-to-dow";

describe("JS_DAY_TO_DOW", () => {
	it("0 → SUNDAY", () => {
		expect(JS_DAY_TO_DOW[0]).toBe("SUNDAY");
	});
	it("1 → MONDAY", () => {
		expect(JS_DAY_TO_DOW[1]).toBe("MONDAY");
	});
	it("6 → SATURDAY", () => {
		expect(JS_DAY_TO_DOW[6]).toBe("SATURDAY");
	});
	it("3 → WEDNESDAY", () => {
		expect(JS_DAY_TO_DOW[3]).toBe("WEDNESDAY");
	});
});
