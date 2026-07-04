import { describe, expect, it } from "vitest";
import { formatPercent } from "@/utils/format-percent";

describe("formatPercent", () => {
	it("0 → 0.00%", () => {
		expect(formatPercent(0)).toBe("0.00%");
	});

	it("1 → 100.00%", () => {
		expect(formatPercent(1)).toBe("100.00%");
	});

	it("0.5 → 50.00%", () => {
		expect(formatPercent(0.5)).toBe("50.00%");
	});

	it("0.1234 → 12.34%", () => {
		expect(formatPercent(0.1234)).toBe("12.34%");
	});

	it("includes % symbol", () => {
		expect(formatPercent(0.25)).toMatch(/%$/);
	});
});
