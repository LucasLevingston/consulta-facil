import { describe, expect, it } from "vitest";
import { couponUsageResponseSchema } from "@/lib/schemas/billing/coupon.schema";

describe("couponUsageResponseSchema", () => {
	it("accepts valid data", () => {
		const result = couponUsageResponseSchema.safeParse({
			id: "1",
			couponId: "c1",
			userId: "u1",
			discountAmount: 5,
			usedAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("accepts data with optional fields", () => {
		const result = couponUsageResponseSchema.safeParse({
			id: "1",
			couponId: "c1",
			couponCode: "SAVE10",
			userId: "u1",
			paymentId: "pay-1",
			discountAmount: 5,
			usedAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing required fields", () => {
		expect(couponUsageResponseSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for discountAmount", () => {
		expect(
			couponUsageResponseSchema.safeParse({
				id: "1",
				couponId: "c1",
				userId: "u1",
				discountAmount: "five",
				usedAt: "2024-01-01",
			}).success,
		).toBe(false);
	});
});
