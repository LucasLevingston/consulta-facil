import { describe, expect, it } from "vitest";
import {
	referralCodeSchema,
	referralSchema,
	referralStatsSchema,
} from "@/lib/schemas/billing/referral.schema";

describe("referralStatsSchema", () => {
	it("accepts valid data", () => {
		const result = referralStatsSchema.safeParse({
			code: "CODE",
			totalReferred: 5,
			pendingCommissions: 2,
			availableCommissions: 3,
			pendingBalance: 50,
			availableBalance: 100,
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(referralStatsSchema.safeParse({}).success).toBe(false);
	});
});

describe("referralSchema", () => {
	it("accepts valid data with null firstPaymentId", () => {
		const result = referralSchema.safeParse({
			id: "1",
			referrerId: "r",
			referredId: "d",
			referralCodeId: "c",
			firstPaymentId: null,
			status: "PENDING",
			createdAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects invalid status", () => {
		expect(
			referralSchema.safeParse({
				id: "1",
				referrerId: "r",
				referredId: "d",
				referralCodeId: "c",
				firstPaymentId: null,
				status: "UNKNOWN",
				createdAt: "2024-01-01",
			}).success,
		).toBe(false);
	});
	it("rejects missing fields", () => {
		expect(referralSchema.safeParse({}).success).toBe(false);
	});
});

describe("referralCodeSchema", () => {
	it("accepts valid data", () => {
		const result = referralCodeSchema.safeParse({
			id: "1",
			userId: "u1",
			code: "CODE123",
			active: true,
			createdAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(referralCodeSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for active", () => {
		expect(
			referralCodeSchema.safeParse({
				id: "1",
				userId: "u1",
				code: "CODE",
				active: "yes",
				createdAt: "2024-01-01",
			}).success,
		).toBe(false);
	});
});
