"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAdminWallets } from "@/features/billing";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(n);

function AdminWalletsContent() {
	const { data: wallets } = useAdminWallets();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Carteiras"
				description="Carteiras financeiras dos usuarios."
				count={wallets.length}
				countLabel="carteira"
				icon={<Wallet className="h-6 w-6" />}
			/>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Usuario</TableHead>
						<TableHead>Saldo</TableHead>
						<TableHead>Pendente</TableHead>
						<TableHead>Atualizado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{wallets.map((w) => (
						<TableRow key={w.id} className="cursor-pointer hover:bg-muted/50">
							<TableCell>
								<Link
									href={`/admin/billing/wallets/${w.userId}`}
									className="font-mono text-xs hover:underline"
								>
									{w.userId.slice(0, 8)}...
								</Link>
							</TableCell>
							<TableCell>{brl(w.balance)}</TableCell>
							<TableCell>{brl(w.pendingBalance)}</TableCell>
							<TableCell>
								{new Date(w.updatedAt).toLocaleDateString("pt-BR")}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export function AdminWalletsView() {
	return (
		<SuspenseBoundary>
			<AdminWalletsContent />
		</SuspenseBoundary>
	);
}
