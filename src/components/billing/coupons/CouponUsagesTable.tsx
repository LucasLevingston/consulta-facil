"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CouponUsageResponse } from "@/lib/schemas/billing/coupon.schema";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
		n,
	);

interface Props {
	usages: CouponUsageResponse[];
}

export function CouponUsagesTable({ usages }: Props) {
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
						<TableCell>{brl(u.discountAmount)}</TableCell>
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
