import { z } from "zod";

export const referralCommissionSchema = z.object({
	id: z.string(),
	referralId: z.string(),
	paymentId: z.string(),
	amount: z.number(),
	percentage: z.number(),
	availableAt: z.string(),
	status: z.enum(["PENDING", "AVAILABLE", "PAID", "CANCELED"]),
	createdAt: z.string(),
});
export type ReferralCommissionResponse = z.infer<
	typeof referralCommissionSchema
>;
export type CommissionStatus = "PENDING" | "AVAILABLE" | "PAID" | "CANCELED";
