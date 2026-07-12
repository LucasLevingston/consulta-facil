"use client";

import { Loader2 } from "lucide-react";
import { ClinicFinancialSummaryCards } from "./ClinicFinancialSummaryCards";
import type { ClinicFinancialTabProps } from "./ClinicFinancialTab.types";
import { ClinicMemberUsageCard } from "./ClinicMemberUsageCard";
import { useClinicFinancialStats } from "./use-clinic-financial-stats";

export function ClinicFinancialTab({ clinic }: ClinicFinancialTabProps) {
	const members = clinic.members ?? [];
	const {
		isLoading,
		memberStats,
		totalCompleted,
		totalFreeUsed,
		totalFreeQuota,
		totalPaid,
		extraProfessionals,
	} = useClinicFinancialStats(members);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<ClinicFinancialSummaryCards
				totalCompleted={totalCompleted}
				totalFreeUsed={totalFreeUsed}
				totalFreeQuota={totalFreeQuota}
				extraProfessionals={extraProfessionals}
			/>
			<ClinicMemberUsageCard
				memberStats={memberStats}
				membersCount={members.length}
				totalFreeQuota={totalFreeQuota}
				totalPaid={totalPaid}
				extraProfessionals={extraProfessionals}
			/>
		</div>
	);
}
