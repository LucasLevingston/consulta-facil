import { describe, expect, it } from "vitest";
import { referralCommissionSchema } from "./commission.schema";

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
