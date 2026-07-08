"use client";

import { BadgePercent } from "lucide-react";
import { CommissionTable } from "@/components/billing/CommissionTable";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { useAdminCommissions } from "@/features/billing";

function AdminCommissionsContent() {
	const { data: commissions } = useAdminCommissions();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Comissoes"
				description="Comissoes do programa de indicacao."
				count={commissions.length}
				countLabel="comissao"
				icon={<BadgePercent className="h-6 w-6" />}
			/>
			<CommissionTable commissions={commissions} />
		</div>
	);
}

export function CommissionsView() {
	return (
		<SuspenseBoundary>
			<AdminCommissionsContent />
		</SuspenseBoundary>
	);
}
