"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import type { PaymentTableProps } from "./PaymentTable.types";

const PAYMENT_TYPE_LABELS: Record<string, string> = {
	CONSULTATION: "Consulta",
	PROCEDURE: "Procedimento",
	EXAM: "Exame",
	SUBSCRIPTION: "Assinatura",
};

export function PaymentTable({ payments }: PaymentTableProps) {
	function formatCurrency(value: number) {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString("pt-BR");
	}

	if (payments.length === 0) {
		return (
			<p className="text-center text-muted-foreground py-8">
				Nenhum pagamento encontrado.
			</p>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Tipo</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead>Taxa sistema</TableHead>
					<TableHead>Líquido</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Data</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{payments.map((p) => (
					<TableRow key={p.id}>
						<TableCell>
							{PAYMENT_TYPE_LABELS[p.paymentType] ?? p.paymentType}
						</TableCell>
						<TableCell>{formatCurrency(p.amount)}</TableCell>
						<TableCell>{formatCurrency(p.systemFee)}</TableCell>
						<TableCell>{formatCurrency(p.netAmount)}</TableCell>
						<TableCell>
							<PaymentStatusBadge status={p.status} />
						</TableCell>
						<TableCell>{formatDate(p.createdAt)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
