import { describe, expect, it } from "vitest";
import { referralCommissionSchema } from "@/lib/schemas/billing/commission.schema";
import { couponResponseSchema } from "@/lib/schemas/billing/coupon.schema";

describe("referralCommissionSchema", () => {
	it("accepts valid data", () => {
		const result = referralCommissionSchema.safeParse({
			id: "1",
			referralId: "r",
			paymentId: "p",
			amount: 50,
			percentage: 0.1,
			availableAt: "2024-01-01",
			status: "PENDING",
			createdAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects invalid status", () => {
		expect(
			referralCommissionSchema.safeParse({
				id: "1",
				referralId: "r",
				paymentId: "p",
				amount: 50,
				percentage: 0.1,
				availableAt: "2024-01-01",
				status: "UNKNOWN",
				createdAt: "2024-01-01",
			}).success,
		).toBe(false);
	});
	it("rejects missing fields", () => {
		expect(referralCommissionSchema.safeParse({}).success).toBe(false);
	});
});

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
