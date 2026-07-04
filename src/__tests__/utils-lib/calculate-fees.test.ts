import { describe, expect, it } from "vitest";
import { calculateFees } from "@/lib/utils/calculate-fees";

const cfg = {
	platformFeeRate: 0.05,
	pixFeeRate: 0.01,
	creditCardFeeRate: 0.04,
	debitFeeRate: 0.02,
};

describe("calculateFees", () => {
	it("returns selected and comparison", () => {
		const result = calculateFees(100, "PIX", cfg);
		expect(result).toHaveProperty("selected");
		expect(result).toHaveProperty("comparison");
	});

	it("comparison has all 5 payment methods", () => {
		const { comparison } = calculateFees(100, "PIX", cfg);
		const methods = comparison.map((c) => c.paymentMethod);
		expect(methods).toContain("PIX");
		expect(methods).toContain("CREDIT_CARD");
		expect(methods).toContain("DEBIT_CARD");
		expect(methods).toContain("CASH");
		expect(methods).toContain("MERCADOPAGO");
	});

	it("CASH has zero MP fee", () => {
		const { comparison } = calculateFees(100, "CASH", cfg);
		const cash = comparison.find((c) => c.paymentMethod === "CASH")!;
		expect(cash.mpFeeAmount).toBe(0);
	});

	it("professional absorbs fees: patientPays = gross = amount", () => {
		const { selected } = calculateFees(100, "PIX", cfg, true);
		expect(selected.patientPays).toBe(100);
		// net = 100 - 1 (pix) - 5 (platform) = 94
		expect(selected.professionalReceives).toBe(94);
	});

	it("patient absorbs fees: professionalReceives = amount", () => {
		const { selected } = calculateFees(100, "PIX", cfg, false);
		expect(selected.professionalReceives).toBe(100);
		expect(selected.patientPays).toBeGreaterThan(100);
	});

	it("totalFees = mpFeeAmount + platformFeeAmount", () => {
		const { selected } = calculateFees(200, "CREDIT_CARD", cfg);
		expect(selected.totalFees).toBeCloseTo(
			selected.mpFeeAmount + selected.platformFeeAmount,
			2,
		);
	});
});
