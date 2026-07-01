"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import type { SystemFeeResponse } from "@/features/billing";
import { PAYMENT_TYPE_LABELS } from "@/utils/constants/payment-type-labels";
import { formatCurrency } from "@/utils/format-currency";
import { formatPercent } from "@/utils/format-percent";

interface Props {
	fee: SystemFeeResponse;
	isEditing: boolean;
	fixedFee: string;
	setFixedFee: (v: string) => void;
	percentageFee: string;
	setPercentageFee: (v: string) => void;
	onSave: () => void;
	onEdit: () => void;
	onCancel: () => void;
	saving: boolean;
}

export function SystemFeeRow({
	fee,
	isEditing,
	fixedFee,
	setFixedFee,
	percentageFee,
	setPercentageFee,
	onSave,
	onEdit,
	onCancel,
	saving,
}: Props) {
	return (
		<TableRow>
			<TableCell>
				{PAYMENT_TYPE_LABELS[fee.paymentType] ?? fee.paymentType}
			</TableCell>
			<TableCell>
				{isEditing ? (
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
				{isEditing ? (
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
				{isEditing ? (
					<div className="flex gap-2">
						<Button size="sm" onClick={onSave} disabled={saving}>
							Salvar
						</Button>
						<Button size="sm" variant="outline" onClick={onCancel}>
							Cancelar
						</Button>
					</div>
				) : (
					<Button size="sm" variant="outline" onClick={onEdit}>
						Editar
					</Button>
				)}
			</TableCell>
		</TableRow>
	);
}
