import type { WalletTransactionResponse } from "@/lib/schemas/billing/wallet.schema";

export interface WalletHistoryTableProps {
	transactions: WalletTransactionResponse[];
}
