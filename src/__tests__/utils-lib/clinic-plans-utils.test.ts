import { describe, expect, it } from "vitest";

import {
	clinicPlans,
	fmtBRL,
} from "@/components/custom/plans/ClinicPlans.utils";

describe("fmtBRL", () => {
	it("formats zero as 0,00", () => {
		expect(fmtBRL(0)).toBe("0,00");
	});

	it("formats integer with two decimal places", () => {
		expect(fmtBRL(100)).toBe("100,00");
	});

	it("formats decimal value", () => {
		expect(fmtBRL(99.9)).toBe("99,90");
	});

	it("formats large value with thousand separator", () => {
		expect(fmtBRL(1234.5)).toBe("1.234,50");
	});
});

describe("clinicPlans", () => {
	it("has exactly 2 plans", () => {
		expect(clinicPlans).toHaveLength(2);
	});

	it("first plan is monthly", () => {
		expect(clinicPlans[0].id).toBe("clinic-monthly");
		expect(clinicPlans[0].period).toBe("/mês");
	});

	it("second plan is yearly with highlight", () => {
		expect(clinicPlans[1].id).toBe("clinic-yearly");
		expect(clinicPlans[1].highlight).toBe(true);
	});

	it("monthly plan has features", () => {
		expect(clinicPlans[0].features.length).toBeGreaterThan(0);
	});

	it("yearly plan mentions economia", () => {
		const hasEconomy = clinicPlans[1].features.some(
			(f) =>
				f.toLowerCase().includes("economize") ||
				f.toLowerCase().includes("economia"),
		);
		expect(hasEconomy).toBe(true);
	});
});
