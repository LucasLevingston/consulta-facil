import { describe, expect, it } from "vitest";
import { getPageNumbers } from "@/components/custom/custom-pagination";

describe("getPageNumbers", () => {
	it("returns all pages when total <= 7", () => {
		expect(getPageNumbers(0, 1)).toEqual([0]);
		expect(getPageNumbers(0, 5)).toEqual([0, 1, 2, 3, 4]);
		expect(getPageNumbers(3, 7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
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

	it("always includes first and last page", () => {
		const pages = getPageNumbers(5, 20);
		expect(pages[0]).toBe(0);
		expect(pages[pages.length - 1]).toBe(19);
	});

	it("always includes current page", () => {
		const pages = getPageNumbers(7, 20);
		expect(pages).toContain(7);
	});

	it("single page returns [0]", () => {
		expect(getPageNumbers(0, 1)).toEqual([0]);
	});
});
