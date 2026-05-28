import { describe, expect, it } from "vitest";

import { getPageNumbers } from "@/components/custom/custom-pagination";

describe("getPageNumbers", () => {
	// ── Small page counts ────────────────────────────────────────────────────

	it("returns all pages when total <= 7", () => {
		expect(getPageNumbers(0, 1)).toEqual([0]);
		expect(getPageNumbers(0, 5)).toEqual([0, 1, 2, 3, 4]);
		expect(getPageNumbers(3, 7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
	});

	// ── Near start ───────────────────────────────────────────────────────────

	it("near start: no left ellipsis, right ellipsis when gap > 1", () => {
		// total=20, current=0 → [0,1,2,"...",19]
		expect(getPageNumbers(0, 20)).toEqual([0, 1, 2, "...", 19]);
	});

	it("near start: no left ellipsis, shows single right page when gap = 1", () => {
		// total=8, current=0: end=min(6,2)=2, rightGap = 7-2-1=4 → ellipsis
		expect(getPageNumbers(0, 8)).toEqual([0, 1, 2, "...", 7]);
	});

	it("current=3 total=8: no unnecessary ellipsis (gap=1 right)", () => {
		// Bug case: old code wrongly showed [...5 "..." 7]
		// start=max(1,1)=1, end=min(6,5)=5, rightGap=7-5-1=1 → show page 6, not "..."
		expect(getPageNumbers(3, 8)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
	});

	it("current=1 total=20: single left page (gap=0), right ellipsis", () => {
		// start=max(1,-1)=1, leftGap=0, end=min(18,3)=3, rightGap=19-3-1=15
		expect(getPageNumbers(1, 20)).toEqual([0, 1, 2, 3, "...", 19]);
	});

	it("current=4 total=20: single left page (gap=1), right ellipsis", () => {
		// start=max(1,2)=2, leftGap=1 → show page 1 not "..."
		expect(getPageNumbers(4, 20)).toEqual([0, 1, 2, 3, 4, 5, 6, "...", 19]);
	});

	// ── Middle ───────────────────────────────────────────────────────────────

	it("middle: both ellipses shown when gaps > 1", () => {
		// total=20, current=10 → [0,"...",8,9,10,11,12,"...",19]
		expect(getPageNumbers(10, 20)).toEqual([
			0,
			"...",
			8,
			9,
			10,
			11,
			12,
			"...",
			19,
		]);
	});

	it("current=5 total=20: left ellipsis (gap=2), right ellipsis", () => {
		// start=3, leftGap=2 → "..."
		expect(getPageNumbers(5, 20)).toEqual([0, "...", 3, 4, 5, 6, 7, "...", 19]);
	});

	// ── Near end ─────────────────────────────────────────────────────────────

	it("near end: left ellipsis, no right ellipsis", () => {
		// total=20, current=19 → [0,"...",17,18,19]
		expect(getPageNumbers(19, 20)).toEqual([0, "...", 17, 18, 19]);
	});

	it("current=16 total=20: left ellipsis, no right ellipsis", () => {
		// start=14, end=min(18,18)=18, rightGap=19-18-1=0
		expect(getPageNumbers(16, 20)).toEqual([0, "...", 14, 15, 16, 17, 18, 19]);
	});

	it("current=15 total=20: left ellipsis, single right page (gap=1)", () => {
		// start=13, end=min(18,17)=17, rightGap=19-17-1=1 → show page 18
		expect(getPageNumbers(15, 20)).toEqual([
			0,
			"...",
			13,
			14,
			15,
			16,
			17,
			18,
			19,
		]);
	});

	// ── Edge cases ───────────────────────────────────────────────────────────

	it("total=2: returns [0, 1] (total <= 7 branch)", () => {
		expect(getPageNumbers(0, 2)).toEqual([0, 1]);
		expect(getPageNumbers(1, 2)).toEqual([0, 1]);
	});

	it("never produces duplicate pages", () => {
		for (let total = 1; total <= 30; total++) {
			for (let current = 0; current < total; current++) {
				const pages = getPageNumbers(current, total).filter(
					(p): p is number => p !== "...",
				);
				const unique = new Set(pages);
				expect(unique.size).toBe(pages.length);
			}
		}
	});

	it("always includes first and last page when total > 7", () => {
		for (let total = 8; total <= 20; total++) {
			for (let current = 0; current < total; current++) {
				const pages = getPageNumbers(current, total);
				expect(pages[0]).toBe(0);
				expect(pages[pages.length - 1]).toBe(total - 1);
			}
		}
	});

	it("always includes current page", () => {
		for (let total = 1; total <= 20; total++) {
			for (let current = 0; current < total; current++) {
				const pages = getPageNumbers(current, total);
				expect(pages).toContain(current);
			}
		}
	});

	it("never has consecutive ellipsis", () => {
		for (let total = 1; total <= 30; total++) {
			for (let current = 0; current < total; current++) {
				const pages = getPageNumbers(current, total);
				for (let i = 0; i < pages.length - 1; i++) {
					const hasConsecutive = pages[i] === "..." && pages[i + 1] === "...";
					expect(hasConsecutive).toBe(false);
				}
			}
		}
	});

	it("never has ellipsis representing a single hidden page", () => {
		for (let total = 1; total <= 30; total++) {
			for (let current = 0; current < total; current++) {
				const pages = getPageNumbers(current, total);
				for (let i = 0; i < pages.length; i++) {
					if (pages[i] !== "...") continue;
					const prev = pages[i - 1] as number;
					const next = pages[i + 1] as number;
					// The gap represented by "..." must be >= 2
					expect(next - prev - 1).toBeGreaterThanOrEqual(2);
				}
			}
		}
	});
});
