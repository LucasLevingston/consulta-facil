import { z } from "zod";

export const referralCodeSchema = z.object({
	id: z.string(),
	userId: z.string(),
	code: z.string(),
	active: z.boolean(),
	createdAt: z.string(),
});
export type ReferralCodeResponse = z.infer<typeof referralCodeSchema>;

export const referralStatsSchema = z.object({
	code: z.string(),
	totalReferred: z.number(),
	pendingCommissions: z.number(),
	availableCommissions: z.number(),
	pendingBalance: z.number(),
	availableBalance: z.number(),
});
export type ReferralStatsResponse = z.infer<typeof referralStatsSchema>;

export const referralSchema = z.object({
	id: z.string(),
	referrerId: z.string(),
	referredId: z.string(),
	referralCodeId: z.string(),
	firstPaymentId: z.string().nullable(),
	status: z.enum(["PENDING", "APPROVED", "REJECTED", "EXPIRED"]),
	createdAt: z.string(),
});
export type ReferralResponse = z.infer<typeof referralSchema>;
export type ReferralStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
