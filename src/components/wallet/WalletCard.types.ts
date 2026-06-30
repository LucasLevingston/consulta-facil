import type { WalletResponse } from "@/features/billing";

export interface WalletCardProps {
	wallet?: WalletResponse;
	isLoading?: boolean;
}
