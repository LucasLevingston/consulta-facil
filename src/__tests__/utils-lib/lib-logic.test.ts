import { describe, expect, it } from "vitest";
import { calculateFees } from "@/lib/utils/calculate-fees";
import { daysOfWeek } from "@/lib/utils/days-of-week";
import { getInitials } from "@/lib/utils/get-initials";
import { getPageNumbers } from "@/lib/utils/get-page-numbers";

const FEE_CFG = {
	pixFeeRate: 0.01,
	creditCardFeeRate: 0.03,
	debitFeeRate: 0.015,
	platformFeeRate: 0.05,
};

describe("getPageNumbers", () => {
	it("returns all pages when total <= 7", () => {
		expect(getPageNumbers(3, 5)).toEqual([0, 1, 2, 3, 4]);
	});
	it("returns empty array for total = 0", () => {
		expect(getPageNumbers(0, 0)).toEqual([]);
	});
	it("always includes first and last page for large sets", () => {
		const pages = getPageNumbers(5, 10);
		expect(pages[0]).toBe(0);
		expect(pages[pages.length - 1]).toBe(9);
	});
	it("includes ellipsis for distant pages", () => {
		expect(getPageNumbers(10, 20)).toContain("...");
	});
});

describe("getInitials", () => {
	it("two-word name → 2 initials", () => {
		expect(getInitials("João Silva")).toBe("JS");
	});
	it("single word → 1 initial", () => {
		expect(getInitials("Maria")).toBe("M");
	});
	it("null → '?'", () => {
		expect(getInitials(null)).toBe("?");
	});
	it("undefined → '?'", () => {
		expect(getInitials(undefined)).toBe("?");
	});
	it("three words → first 2 initials only", () => {
		expect(getInitials("Ana Clara Souza")).toBe("AC");
	});
});

describe("daysOfWeek (lib)", () => {
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

describe("calculateFees", () => {
	it("returns selected and comparison", () => {
		const r = calculateFees(100, "PIX", FEE_CFG);
		expect(r).toHaveProperty("selected");
		expect(r).toHaveProperty("comparison");
	});
	it("patientPays equals amount when profAbsorbs=true", () => {
		expect(calculateFees(100, "PIX", FEE_CFG, true).selected.patientPays).toBe(
			100,
		);
	});
	it("CASH has zero mpFeeAmount", () => {
		expect(calculateFees(100, "CASH", FEE_CFG, true).selected.mpFeeAmount).toBe(
			0,
		);
	});
	it("comparison includes all 5 payment methods", () => {
		expect(calculateFees(100, "PIX", FEE_CFG).comparison).toHaveLength(5);
	});
});
