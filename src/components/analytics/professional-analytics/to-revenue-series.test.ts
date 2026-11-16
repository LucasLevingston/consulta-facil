import { describe, expect, it } from "vitest";
import { toRevenueSeries } from "./to-revenue-series";

describe("toRevenueSeries", () => {
	it("turns ISO months into MM/yyyy labels and keeps the order", () => {
		expect(
			toRevenueSeries([
				{ month: "2025-12", amount: 0 },
				{ month: "2026-01", amount: 350.5 },
			]),
		).toEqual([
			{ label: "12/2025", value: 0 },
			{ label: "01/2026", value: 350.5 },
		]);
	});

	it("returns an empty series for no months", () => {
		expect(toRevenueSeries([])).toEqual([]);
	});
});
