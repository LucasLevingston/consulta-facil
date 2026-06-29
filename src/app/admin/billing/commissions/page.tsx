"use client";

import { BadgePercent } from "lucide-react";
import { CommissionTable } from "@/components/billing/CommissionTable";
import PageHeader from "@/components/custom/page-header";
import { useAdminCommissions } from "@/features/billing";

export default function AdminCommissionsPage() {
	const { data: commissions = [], isLoading } = useAdminCommissions();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Comissoes"
				description="Comissoes do programa de indicacao."
				count={commissions.length}
				countLabel="comissao"
				icon={<BadgePercent className="h-6 w-6" />}
			/>

			{isLoading ? (
				<p className="text-sm text-muted-foreground">Carregando...</p>
			) : (
				<CommissionTable commissions={commissions} />
			)}
		</div>
	);
}
