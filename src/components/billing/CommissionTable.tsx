import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CommissionStatus } from "@/features/billing";
import { formatBRL } from "@/utils/format-brl";
import type { CommissionTableProps } from "./CommissionTable.types";

const STATUS_LABELS: Record<CommissionStatus, string> = {
	PENDING: "Pendente",
	AVAILABLE: "Disponivel",
	PAID: "Pago",
	CANCELED: "Cancelado",
};

const STATUS_VARIANT: Record<
	CommissionStatus,
	"secondary" | "default" | "destructive"
> = {
	PENDING: "secondary",
	AVAILABLE: "default",
	PAID: "default",
	CANCELED: "destructive",
};

export function CommissionTable({ commissions }: CommissionTableProps) {
	if (commissions.length === 0) {
		return (
			<p className="text-sm text-muted-foreground py-4">
				Nenhuma comissao encontrada.
			</p>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Valor</TableHead>
					<TableHead>%</TableHead>
					<TableHead>Disponivel em</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{commissions.map((c) => (
					<TableRow key={c.id}>
						<TableCell>{formatBRL(c.amount)}</TableCell>
						<TableCell>{c.percentage}%</TableCell>
						<TableCell>
							{new Date(c.availableAt).toLocaleDateString("pt-BR")}
						</TableCell>
						<TableCell>
							<Badge variant={STATUS_VARIANT[c.status]}>
								{STATUS_LABELS[c.status]}
							</Badge>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
