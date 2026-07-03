import { describe, expect, it } from "vitest";
import {
	couponValidationResultSchema,
	updateCouponSchema,
} from "@/lib/schemas/billing/coupon.schema";

describe("updateCouponSchema", () => {
	it("accepts empty object (all fields optional)", () => {
		expect(updateCouponSchema.safeParse({}).success).toBe(true);
	});
	it("accepts valid status INACTIVE", () => {
		expect(updateCouponSchema.safeParse({ status: "INACTIVE" }).success).toBe(
			true,
		);
	});
	it("accepts valid status EXPIRED", () => {
		expect(updateCouponSchema.safeParse({ status: "EXPIRED" }).success).toBe(
			true,
		);
	});
	it("rejects invalid status", () => {
		expect(updateCouponSchema.safeParse({ status: "INVALID" }).success).toBe(
			false,
		);
	});
	it("rejects maxUses below 1", () => {
		expect(updateCouponSchema.safeParse({ maxUses: 0 }).success).toBe(false);
	});
});

describe("couponValidationResultSchema", () => {
	it("accepts valid data", () => {
		const result = couponValidationResultSchema.safeParse({
			valid: true,
			discountAmount: 10,
			finalAmount: 90,
			message: "Coupon applied",
		});
		expect(result.success).toBe(true);
	});
	it("accepts data with optional couponCode", () => {
		const result = couponValidationResultSchema.safeParse({
			valid: false,
			discountAmount: 0,
			finalAmount: 100,
			message: "Invalid coupon",
			couponCode: "INVALID",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing required fields", () => {
		expect(couponValidationResultSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for valid field", () => {
		expect(
			couponValidationResultSchema.safeParse({
				valid: "yes",
				discountAmount: 10,
				finalAmount: 90,
				message: "OK",
			}).success,
		).toBe(false);
	});
});
