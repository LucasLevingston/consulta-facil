"use client";

import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/billing/wallet.api";

export function useAdminWallets() {
	return useQuery({ queryKey: ["admin-wallets"], queryFn: walletApi.adminListAll });
}
