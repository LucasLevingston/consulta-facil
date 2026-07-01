import { referralApi } from "@/lib/api/billing/referral.api";
import { walletApi } from "@/lib/api/billing/wallet.api";
import type {
	WalletResponse,
	WalletTransactionResponse,
} from "@/lib/schemas/billing/wallet.schema";

export const billingWalletRepository = {
	getMyReferralStats: async () => referralApi.myStats(),
	regenerateReferralCode: async () => referralApi.regenerate(),
	adminListReferrals: async () => referralApi.adminListAll(),

	getMyWallet: async (): Promise<WalletResponse> => walletApi.myWallet(),
	getMyWalletTransactions: async (): Promise<WalletTransactionResponse[]> =>
		walletApi.myTransactions(),
	adminListWallets: async (): Promise<WalletResponse[]> =>
		walletApi.adminListAll(),
	getUserWallet: async (userId: string): Promise<WalletResponse> =>
		walletApi.adminGetWallet(userId),
	getUserWalletTransactions: async (
		userId: string,
	): Promise<WalletTransactionResponse[]> =>
		walletApi.adminGetTransactions(userId),
};
