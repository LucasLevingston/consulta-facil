"use client";

import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatBRL } from "@/utils/format-brl";
import type { CouponsTableProps } from "./CouponsTable.types";
import { EditCouponDialog } from "./EditCouponDialog";

const STATUS_LABELS: Record<string, string> = {
	ACTIVE: "Ativo",
	INACTIVE: "Inativo",
	EXPIRED: "Expirado",
};

const STATUS_VARIANTS: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	ACTIVE: "default",
	INACTIVE: "secondary",
	EXPIRED: "destructive",
};

export function CouponsTable({ coupons }: CouponsTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Código</TableHead>
					<TableHead>Tipo</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead>Usos</TableHead>
					<TableHead>Expira em</TableHead>
					<TableHead>Status</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{coupons.map((c) => (
					<TableRow key={c.id}>
						<TableCell className="font-mono font-semibold">{c.code}</TableCell>
						<TableCell>{c.type === "PERCENT" ? "%" : "R$"}</TableCell>
						<TableCell>
							{c.type === "PERCENT" ? `${c.value}%` : formatBRL(c.value)}
						</TableCell>
						<TableCell>
							{c.currentUses}
							{c.maxUses ? ` / ${c.maxUses}` : ""}
						</TableCell>
						<TableCell>
							{c.expiresAt
								? new Date(c.expiresAt).toLocaleDateString("pt-BR")
								: "—"}
						</TableCell>
						<TableCell>
							<Badge variant={STATUS_VARIANTS[c.status] ?? "outline"}>
								{STATUS_LABELS[c.status] ?? c.status}
							</Badge>
						</TableCell>
						<TableCell>
							<EditCouponDialog coupon={c} />
						</TableCell>
					</TableRow>
				))}
				{coupons.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={7}
							className="text-center text-muted-foreground"
						>
							Nenhum cupom cadastrado.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
