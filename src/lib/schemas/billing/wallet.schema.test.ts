import { describe, expect, it } from "vitest";
import { walletSchema, walletTransactionSchema } from "./wallet.schema";

describe("walletSchema", () => {
	it("accepts valid data", () => {
		const result = walletSchema.safeParse({
			id: "1",
			userId: "u",
			balance: 100,
			pendingBalance: 50,
			createdAt: "2024-01-01",
			updatedAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(walletSchema.safeParse({}).success).toBe(false);
	});
});

describe("walletTransactionSchema", () => {
	it("accepts valid DEPOSIT transaction", () => {
		const result = walletTransactionSchema.safeParse({
			id: "1",
			walletId: "w1",
			type: "DEPOSIT",
			amount: 100,
			description: null,
			referenceId: null,
			referenceType: null,
			createdAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("accepts REFERRAL_COMMISSION type", () => {
		const result = walletTransactionSchema.safeParse({
			id: "2",
			walletId: "w1",
			type: "REFERRAL_COMMISSION",
			amount: 50,
			description: "Commission",
			referenceId: "ref1",
			referenceType: "REFERRAL",
			createdAt: "2024-01-01",
		});
		expect(result.success).toBe(true);
	});
	it("rejects invalid transaction type", () => {
		expect(
			walletTransactionSchema.safeParse({
				id: "1",
				walletId: "w1",
				type: "INVALID",
				amount: 100,
				description: null,
				referenceId: null,
				referenceType: null,
				createdAt: "2024-01-01",
			}).success,
		).toBe(false);
	});
	it("rejects missing fields", () => {
		expect(walletTransactionSchema.safeParse({}).success).toBe(false);
	});
});
