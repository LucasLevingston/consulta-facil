"use client";

import { Wallet } from "lucide-react";
import { use } from "react";
import PageHeader from "@/components/custom/page-header";
import { WalletCard } from "@/components/wallet/WalletCard";
import { WalletHistoryTable } from "@/components/wallet/WalletHistoryTable";
import { useUserWallet, useUserWalletTransactions } from "@/features/billing";

interface Props {
	params: Promise<{ userId: string }>;
}

export default function AdminUserWalletPage({ params }: Props) {
	const { userId } = use(params);
	const { data: wallet, isLoading } = useUserWallet(userId);
	const { data: transactions = [] } = useUserWalletTransactions(userId);

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Carteira do Usuario"
				description={`ID: ${userId}`}
				icon={<Wallet className="h-6 w-6" />}
			/>

			<WalletCard wallet={wallet} isLoading={isLoading} />

			<div>
				<h2 className="text-lg font-semibold mb-4">Historico</h2>
				<WalletHistoryTable transactions={transactions} />
			</div>
		</div>
	);
}
