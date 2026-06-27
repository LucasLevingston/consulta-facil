import type { WalletResponse } from "@/lib/schemas/billing/wallet.schema";

export interface WalletCardProps {
	wallet?: WalletResponse;
	isLoading?: boolean;
}
