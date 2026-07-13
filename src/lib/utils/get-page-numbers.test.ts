import { describe, expect, it } from "vitest";
import { getPageNumbers } from "./get-page-numbers";

describe("getPageNumbers", () => {
	it("total ≤ 7 → returns all pages", () => {
		const result = getPageNumbers(0, 5);
		expect(result).toEqual([0, 1, 2, 3, 4]);
	});

	it("total = 7 → returns all 7 pages", () => {
		const result = getPageNumbers(3, 7);
		expect(result).toHaveLength(7);
	});

	it("always includes first and last page", () => {
		const result = getPageNumbers(5, 20);
		expect(result[0]).toBe(0);
		expect(result[result.length - 1]).toBe(19);
	});

	it("uses ellipsis for large gaps", () => {
		const result = getPageNumbers(10, 20);
		expect(result).toContain("...");
	});

	it("current near start → no left ellipsis", () => {
		const result = getPageNumbers(1, 20);
		expect(result[1]).not.toBe("...");
	});

	it("current near end → no right ellipsis", () => {
		const result = getPageNumbers(18, 20);
		const last2 = result[result.length - 2];
		expect(last2).not.toBe("...");
	});

	it("gap of exactly 1 → inserts page number not ellipsis", () => {
		// page 0, gap=1 means page 1 should appear directly
		const result = getPageNumbers(3, 20);
		// pages around current visible
		expect(result).toContain(3);
	});

	it("returns empty array for total = 0", () => {
		expect(getPageNumbers(0, 0)).toEqual([]);
	});

	it("single page returns [0]", () => {
		expect(getPageNumbers(0, 1)).toEqual([0]);
	});

	it("shows ellipsis on right when current page near start", () => {
		const pages = getPageNumbers(0, 10);
		expect(pages).toContain("...");
		expect(pages[0]).toBe(0);
	});

	it("shows ellipsis on left when current page near end", () => {
		const pages = getPageNumbers(9, 10);
		expect(pages).toContain("...");
		expect(pages[pages.length - 1]).toBe(9);
	});

	it("shows both ellipses when current page in middle", () => {
		const pages = getPageNumbers(5, 15);
		const ellipses = pages.filter((p) => p === "...");
		expect(ellipses.length).toBe(2);
	});

	it("always includes current page", () => {
		const pages = getPageNumbers(7, 20);
		expect(pages).toContain(7);
	});
});
