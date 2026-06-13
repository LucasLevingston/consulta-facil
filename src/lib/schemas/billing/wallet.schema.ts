import { z } from "zod";

export const walletSchema = z.object({
	id: z.string(),
	userId: z.string(),
	balance: z.number(),
	pendingBalance: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type WalletResponse = z.infer<typeof walletSchema>;

export const walletTransactionSchema = z.object({
	id: z.string(),
	walletId: z.string(),
	type: z.enum(["REFERRAL_COMMISSION", "WITHDRAW", "DEPOSIT", "ADJUSTMENT"]),
	amount: z.number(),
	description: z.string().nullable(),
	referenceId: z.string().nullable(),
	referenceType: z.string().nullable(),
	createdAt: z.string(),
});
export type WalletTransactionResponse = z.infer<typeof walletTransactionSchema>;
export type WalletTransactionType =
	| "REFERRAL_COMMISSION"
	| "WITHDRAW"
	| "DEPOSIT"
	| "ADJUSTMENT";
