"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatBRL } from "@/utils/format-brl";
import type { CouponUsagesTableProps } from "./CouponUsagesTable.types";

export function CouponUsagesTable({ usages }: CouponUsagesTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Usuário</TableHead>
					<TableHead>Cupom</TableHead>
					<TableHead>Desconto</TableHead>
					<TableHead>Data</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{usages.map((u) => (
					<TableRow key={u.id}>
						<TableCell className="font-mono text-xs">
							{u.userId.slice(0, 8)}...
						</TableCell>
						<TableCell className="font-mono">
							{u.couponCode ?? u.couponId}
						</TableCell>
						<TableCell>{formatBRL(u.discountAmount)}</TableCell>
						<TableCell>
							{new Date(u.usedAt).toLocaleDateString("pt-BR")}
						</TableCell>
					</TableRow>
				))}
				{usages.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={4}
							className="text-center text-muted-foreground"
						>
							Nenhum uso registrado.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
