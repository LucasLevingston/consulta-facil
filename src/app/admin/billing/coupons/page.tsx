"use client";

import { Tag } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAdminCouponUsages } from "@/hooks/api/billing/use-coupons";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(n);

export default function AdminCouponsPage() {
	const { data: usages = [], isLoading } = useAdminCouponUsages();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Cupons"
				description="Historico de uso de cupons de desconto."
				count={usages.length}
				countLabel="uso"
				icon={<Tag className="h-6 w-6" />}
			/>

			{isLoading ? (
				<p className="text-sm text-muted-foreground">Carregando...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Usuario</TableHead>
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
					</TableBody>
				</Table>
			)}
		</div>
	);
}
