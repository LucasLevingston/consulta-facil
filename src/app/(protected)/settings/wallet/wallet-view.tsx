"use client";

import { Wallet } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { WalletCard } from "@/components/wallet/WalletCard";
import { WalletHistoryTable } from "@/components/wallet/WalletHistoryTable";
import { useMyWallet } from "./use-my-wallet";
import { useMyWalletTransactions } from "./use-my-wallet-transactions";

function WalletSettingsContent() {
	const { data: wallet } = useMyWallet();
	const { data: transactions } = useMyWalletTransactions();

	return (
		<>
			<WalletCard wallet={wallet} isLoading={false} />

			<div>
				<h2 className="text-lg font-semibold mb-4">Historico</h2>
				<WalletHistoryTable transactions={transactions} />
			</div>
		</>
	);
}

export function WalletSettingsView() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Minha Carteira"
				description="Saldo e historico de transacoes da sua carteira."
				icon={<Wallet className="h-6 w-6" />}
			/>

			<SuspenseBoundary>
				<WalletSettingsContent />
			</SuspenseBoundary>
		</div>
	);
}
