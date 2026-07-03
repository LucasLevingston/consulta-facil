"use client";

import { Wallet } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { WalletCard } from "@/components/wallet/WalletCard";
import { WalletHistoryTable } from "@/components/wallet/WalletHistoryTable";
import { useMyWallet, useMyWalletTransactions } from "@/features/billing";

export default function WalletSettingsPage() {
	const { data: wallet, isLoading } = useMyWallet();
	const { data: transactions = [] } = useMyWalletTransactions();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Minha Carteira"
				description="Saldo e historico de transacoes da sua carteira."
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
