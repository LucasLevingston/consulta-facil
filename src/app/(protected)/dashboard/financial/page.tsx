"use client";

import { TrendingUp } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { useProfessionalAppointments } from "@/hooks/api/appointments/use-professional-appointments";
import { useMyProfessionalProfile } from "@/hooks/api/doctors/use-my-professional-profile";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";
import { FinancialContent } from "./_components/FinancialContent";

export default function FinancialPage() {
	const { user } = useUserStore();
	const { data: profile } = useMyProfessionalProfile(true);
	const professionalId = profile?.id ?? "";

	const { data, isLoading, error } = useProfessionalAppointments(
		professionalId,
		0,
		500,
	);

	const appointments = data?.content ?? [];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Financeiro"
				description="Receita, ticket médio e evolução dos pagamentos."
				icon={<TrendingUp className="h-6 w-6" />}
			/>
			<QueryBoundary isLoading={isLoading || !user} error={error}>
				<FinancialContent appointments={appointments} />
			</QueryBoundary>
		</div>
	);
}
