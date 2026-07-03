import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { WalletTransactionType } from "@/features/billing";
import { formatBRL } from "@/utils/format-brl";
import type { WalletHistoryTableProps } from "./WalletHistoryTable.types";

const TYPE_LABELS: Record<WalletTransactionType, string> = {
	REFERRAL_COMMISSION: "Comissao de Indicacao",
	WITHDRAW: "Saque",
	DEPOSIT: "Deposito",
	ADJUSTMENT: "Ajuste",
};

export function WalletHistoryTable({ transactions }: WalletHistoryTableProps) {
	if (transactions.length === 0) {
		return (
			<p className="text-sm text-muted-foreground py-4">
				Nenhuma transacao encontrada.
			</p>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Tipo</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead>Descricao</TableHead>
					<TableHead>Data</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transactions.map((t) => (
					<TableRow key={t.id}>
						<TableCell>{TYPE_LABELS[t.type]}</TableCell>
						<TableCell>{formatBRL(t.amount)}</TableCell>
						<TableCell className="text-muted-foreground">
							{t.description ?? "-"}
						</TableCell>
						<TableCell>
							{new Date(t.createdAt).toLocaleDateString("pt-BR")}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
