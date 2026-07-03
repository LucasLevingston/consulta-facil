import { describe, expect, it } from "vitest";
import { createBillingPaymentSchema } from "@/lib/schemas/billing/payment.schema";
import { referralCodeSchema } from "@/lib/schemas/billing/referral.schema";

describe("createBillingPaymentSchema", () => {
	it("accepts valid minimal data", () => {
		const result = createBillingPaymentSchema.safeParse({
			paymentType: "CONSULTATION",
			amount: 150,
			payerId: "user-123",
		});
		expect(result.success).toBe(true);
	});
	it("accepts all optional fields", () => {
		const result = createBillingPaymentSchema.safeParse({
			paymentType: "EXAM",
			amount: 200,
			payerId: "user-123",
			ownerType: "CLINIC",
			ownerId: "clinic-1",
			payerEmail: "patient@example.com",
			description: "Exam payment",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing payerId", () => {
		expect(
			createBillingPaymentSchema.safeParse({
				paymentType: "CONSULTATION",
				amount: 100,
			}).success,
		).toBe(false);
	});
	it("rejects invalid paymentType", () => {
		expect(
			createBillingPaymentSchema.safeParse({
				paymentType: "INVALID",
				amount: 100,
				payerId: "u",
			}).success,
		).toBe(false);
	});
	it("rejects non-positive amount", () => {
		expect(
			createBillingPaymentSchema.safeParse({
				paymentType: "EXAM",
				amount: 0,
				payerId: "u",
			}).success,
		).toBe(false);
	});
	it("rejects invalid payerEmail", () => {
		expect(
			createBillingPaymentSchema.safeParse({
				paymentType: "EXAM",
				amount: 10,
				payerId: "u",
				payerEmail: "not-email",
			}).success,
		).toBe(false);
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
