"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useSystemFees,
	useUpdateSystemFee,
} from "@/hooks/api/billing/use-system-fees";
import type { SystemFeeResponse } from "@/lib/schemas/billing/system-fee.schema";

const PAYMENT_TYPE_LABELS: Record<string, string> = {
	CONSULTATION: "Consulta",
	PROCEDURE: "Procedimento",
	EXAM: "Exame",
	SUBSCRIPTION: "Assinatura",
};

function formatCurrency(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

function formatPercent(value: number) {
	return `${(value * 100).toFixed(2)}%`;
}

export default function AdminSystemFeesPage() {
	const { data: fees = [], isLoading } = useSystemFees();
	const updateFee = useUpdateSystemFee();
	const [editing, setEditing] = useState<string | null>(null);
	const [fixedFee, setFixedFee] = useState("");
	const [percentageFee, setPercentageFee] = useState("");

	function startEdit(fee: SystemFeeResponse) {
		setEditing(fee.id);
		setFixedFee(String(fee.fixedFee));
		setPercentageFee(String(fee.percentageFee));
	}

	function handleSave(id: string) {
		updateFee.mutate(
			{
				id,
				data: {
					fixedFee: Number(fixedFee),
					percentageFee: Number(percentageFee),
				},
			},
			{ onSuccess: () => setEditing(null) },
		);
	}

	return (
		<div className="space-y-6 p-6">
			<div>
				<h1 className="text-2xl font-bold">Taxas do Sistema</h1>
				<p className="text-muted-foreground">
					Taxas cobradas por tipo de transação.
				</p>
			</div>
			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tipo</TableHead>
							<TableHead>Taxa Fixa</TableHead>
							<TableHead>Taxa %</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{fees.map((fee: SystemFeeResponse) => (
							<TableRow key={fee.id}>
								<TableCell>
									{PAYMENT_TYPE_LABELS[fee.paymentType] ?? fee.paymentType}
								</TableCell>
								<TableCell>
									{editing === fee.id ? (
										<Input
											type="number"
											value={fixedFee}
											onChange={(e) => setFixedFee(e.target.value)}
											className="w-24"
										/>
									) : (
										formatCurrency(fee.fixedFee)
									)}
								</TableCell>
								<TableCell>
									{editing === fee.id ? (
										<Input
											type="number"
											value={percentageFee}
											onChange={(e) => setPercentageFee(e.target.value)}
											className="w-24"
										/>
									) : (
										formatPercent(fee.percentageFee)
									)}
								</TableCell>
								<TableCell>
									<Badge variant={fee.active ? "default" : "secondary"}>
										{fee.active ? "Ativo" : "Inativo"}
									</Badge>
								</TableCell>
								<TableCell>
									{editing === fee.id ? (
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() => handleSave(fee.id)}
												disabled={updateFee.isPending}
											>
												Salvar
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => setEditing(null)}
											>
												Cancelar
											</Button>
										</div>
									) : (
										<Button
											size="sm"
											variant="outline"
											onClick={() => startEdit(fee)}
										>
											Editar
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
