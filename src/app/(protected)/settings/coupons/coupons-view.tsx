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
import { useUserStore } from "@/features/auth";
import { useUserCouponHistory } from "@/features/billing";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(n);

export function CouponsSettingsView() {
	const { user } = useUserStore();
	const { data: usages = [], isLoading } = useUserCouponHistory(user?.id ?? "");

	return (
		<div className="space-y-6">
			<PageHeader
				title="Meus Cupons"
				description="Historico de cupons utilizados."
				count={usages.length}
				countLabel="cupom"
				icon={<Tag className="h-6 w-6" />}
			/>

			{isLoading ? (
				<p className="text-sm text-muted-foreground">Carregando...</p>
			) : usages.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					Nenhum cupom utilizado ainda.
				</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Cupom</TableHead>
							<TableHead>Desconto</TableHead>
							<TableHead>Data</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{usages.map((u) => (
							<TableRow key={u.id}>
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
