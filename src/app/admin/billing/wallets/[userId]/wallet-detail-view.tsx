"use client";

import { Wallet } from "lucide-react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { WalletCard } from "@/components/wallet/WalletCard";
import { WalletHistoryTable } from "@/components/wallet/WalletHistoryTable";
import { useUserWallet, useUserWalletTransactions } from "@/features/billing";

function WalletDetailContent() {
	const { userId } = useParams<{ userId: string }>();
	const { data: wallet } = useUserWallet(userId);
	const { data: transactions } = useUserWalletTransactions(userId);

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Carteira do Usuario"
				description={`ID: ${userId}`}
				icon={<Wallet className="h-6 w-6" />}
			/>

			<WalletCard wallet={wallet} isLoading={false} />

			<div>
				<h2 className="text-lg font-semibold mb-4">Historico</h2>
				<WalletHistoryTable transactions={transactions} />
			</div>
		</div>
	);
}

export function WalletDetailView() {
	return (
		<SuspenseBoundary>
			<WalletDetailContent />
		</SuspenseBoundary>
	);
}
