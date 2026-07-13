import { describe, expect, it } from "vitest";
import {
	feeCalculationResponseSchema,
	feeConfigSchema,
	paymentMethodBreakdownSchema,
} from "./fee-calculation.schema";

const validBreakdown = {
	paymentMethod: "PIX",
	mpFeeRate: 0.01,
	mpFeeAmount: 1,
	platformFeeAmount: 2,
	totalFees: 3,
	professionalReceives: 97,
	patientPays: 100,
};

describe("paymentMethodBreakdownSchema", () => {
	it("accepts valid data", () => {
		expect(paymentMethodBreakdownSchema.safeParse(validBreakdown).success).toBe(
			true,
		);
	});
	it("rejects missing fields", () => {
		expect(paymentMethodBreakdownSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for mpFeeRate", () => {
		expect(
			paymentMethodBreakdownSchema.safeParse({
				...validBreakdown,
				mpFeeRate: "0.01",
			}).success,
		).toBe(false);
	});
});

describe("feeCalculationResponseSchema", () => {
	it("accepts valid data", () => {
		const result = feeCalculationResponseSchema.safeParse({
			amount: 100,
			paymentMethod: "PIX",
			mpFeeRate: 0.01,
			mpFeeAmount: 1,
			platformFeeRate: 0.02,
			platformFeeAmount: 2,
			totalFees: 3,
			professionalReceives: 97,
			patientPays: 100,
			comparison: [validBreakdown],
		});
		expect(result.success).toBe(true);
	});
	it("accepts empty comparison array", () => {
		const result = feeCalculationResponseSchema.safeParse({
			amount: 100,
			paymentMethod: "PIX",
			mpFeeRate: 0.01,
			mpFeeAmount: 1,
			platformFeeRate: 0.02,
			platformFeeAmount: 2,
			totalFees: 3,
			professionalReceives: 97,
			patientPays: 100,
			comparison: [],
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(feeCalculationResponseSchema.safeParse({}).success).toBe(false);
	});
});

describe("feeConfigSchema", () => {
	it("accepts valid data", () => {
		const result = feeConfigSchema.safeParse({
			pixFeeRate: 0.01,
			creditCardFeeRate: 0.03,
			debitFeeRate: 0.02,
			platformFeeRate: 0.05,
			planSlug: "basic",
			planName: "Basic",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(feeConfigSchema.safeParse({}).success).toBe(false);
	});
});
