import { describe, expect, it } from "vitest";
import { updateSystemFeeSchema } from "@/lib/schemas/billing/system-fee.schema";

describe("updateSystemFeeSchema", () => {
	it("accepts valid full data", () => {
		const result = updateSystemFeeSchema.safeParse({
			fixedFee: 1.5,
			percentageFee: 0.05,
			active: true,
		});
		expect(result.success).toBe(true);
	});
	it("accepts empty object (all fields optional)", () => {
		expect(updateSystemFeeSchema.safeParse({}).success).toBe(true);
	});
	it("rejects percentageFee above 1", () => {
		expect(
			updateSystemFeeSchema.safeParse({ percentageFee: 1.5 }).success,
		).toBe(false);
	});
	it("rejects negative fixedFee", () => {
		expect(updateSystemFeeSchema.safeParse({ fixedFee: -1 }).success).toBe(
			false,
		);
	});
});
