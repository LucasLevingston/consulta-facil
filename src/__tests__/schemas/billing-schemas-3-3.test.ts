import { describe, expect, it } from "vitest";
import { createCouponSchema } from "@/lib/schemas/billing/coupon.schema";

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
