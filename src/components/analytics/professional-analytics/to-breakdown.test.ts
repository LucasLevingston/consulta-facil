import { describe, expect, it } from "vitest";
import { toBreakdown } from "./to-breakdown";

describe("toBreakdown", () => {
	it("adds each entry's share of the total, rounded to one decimal", () => {
		expect(
			toBreakdown([
				{ label: "A", count: 1 },
				{ label: "B", count: 2 },
			]),
		).toEqual([
			{ label: "A", count: 1, percentage: 33.3 },
			{ label: "B", count: 2, percentage: 66.7 },
		]);
	});

	it("uses 0% for every entry when the total is zero", () => {
		expect(toBreakdown([{ label: "A", count: 0 }])).toEqual([
			{ label: "A", count: 0, percentage: 0 },
		]);
	});

	it("returns an empty list for no entries", () => {
		expect(toBreakdown([])).toEqual([]);
	});
});
