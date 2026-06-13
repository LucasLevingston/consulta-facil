import { api } from "@/config/api";
import type {
	WalletResponse,
	WalletTransactionResponse,
} from "@/lib/schemas/billing/wallet.schema";

export const walletApi = {
	myWallet: async (): Promise<WalletResponse> => {
		const res = await api.get<WalletResponse>("/wallet/me");
		return res.data;
	},

	myTransactions: async (): Promise<WalletTransactionResponse[]> => {
		const res = await api.get<WalletTransactionResponse[]>(
			"/wallet/me/transactions",
		);
		return res.data;
	},

	adminListAll: async (): Promise<WalletResponse[]> => {
		const res = await api.get<WalletResponse[]>("/admin/billing/wallets");
		return res.data;
	},

	adminGetWallet: async (userId: string): Promise<WalletResponse> => {
		const res = await api.get<WalletResponse>(
			`/admin/billing/wallets/${userId}`,
		);
		return res.data;
	},

	adminGetTransactions: async (
		userId: string,
	): Promise<WalletTransactionResponse[]> => {
		const res = await api.get<WalletTransactionResponse[]>(
			`/admin/billing/wallets/${userId}/transactions`,
		);
		return res.data;
	},
};
