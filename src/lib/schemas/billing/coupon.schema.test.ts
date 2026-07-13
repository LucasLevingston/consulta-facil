import { describe, expect, it } from "vitest";
import {
	couponResponseSchema,
	couponUsageResponseSchema,
	couponValidationResultSchema,
	createCouponSchema,
	updateCouponSchema,
} from "./coupon.schema";

describe("couponResponseSchema", () => {
	it("accepts valid data", () => {
		const result = couponResponseSchema.safeParse({
			id: "1",
			code: "SAVE10",
			type: "PERCENT",
			value: 10,
			currentUses: 0,
			maxUsesPerUser: 1,
			status: "ACTIVE",
		});
		expect(result.success).toBe(true);
	});
	it("rejects invalid coupon type", () => {
		expect(
			couponResponseSchema.safeParse({
				id: "1",
				code: "SAVE10",
				type: "INVALID",
				value: 10,
				currentUses: 0,
				maxUsesPerUser: 1,
				status: "ACTIVE",
			}).success,
		).toBe(false);
	});
	it("rejects invalid status", () => {
		expect(
			couponResponseSchema.safeParse({
				id: "1",
				code: "SAVE10",
				type: "FIXED",
				value: 10,
				currentUses: 0,
				maxUsesPerUser: 1,
				status: "INVALID",
			}).success,
		).toBe(false);
	});
});

describe("createCouponSchema", () => {
	it("accepts valid minimal data", () => {
		expect(
			createCouponSchema.safeParse({ code: "SAVE10", type: "FIXED", value: 10 })
				.success,
		).toBe(true);
	});
	it("rejects code too short (min 2)", () => {
		expect(
			createCouponSchema.safeParse({ code: "S", type: "FIXED", value: 10 })
				.success,
		).toBe(false);
	});
	it("rejects value too low (min 0.01)", () => {
		expect(
			createCouponSchema.safeParse({
				code: "SAVE10",
				type: "PERCENT",
				value: 0,
			}).success,
		).toBe(false);
	});
	it("rejects missing required fields", () => {
		expect(createCouponSchema.safeParse({}).success).toBe(false);
	});
});

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
