"use client";

import { TrendingUp } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { FinancialContent } from "@/components/financial/FinancialContent";
import {
	useAllAdminAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { usePermission } from "@/features/auth";
import { useMyProfessionalProfile } from "@/features/professionals";
import { QueryBoundary } from "@/providers/query-boundary";

export default function FinancialPage() {
	const { role } = usePermission();
	const isAdmin = role === "ADMIN";
	const isProfessional = role === "PROFESSIONAL";

	const { data: profile } = useMyProfessionalProfile(isProfessional);
	const professionalId = profile?.id ?? "";

	const adminQuery = useAllAdminAppointments(0, 1000);
	const professionalQuery = useProfessionalAppointments(
		isProfessional ? professionalId : "",
		0,
		500,
	);

	const { data, isLoading, error } = isAdmin ? adminQuery : professionalQuery;
	const appointments = data?.content ?? [];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Financeiro"
				description={
					isAdmin
						? "Receita, ticket médio e evolução dos pagamentos de toda a plataforma."
						: "Receita, ticket médio e evolução dos pagamentos."
				}
				icon={<TrendingUp className="h-6 w-6" />}
			/>
			<QueryBoundary isLoading={isLoading} error={error}>
				<FinancialContent appointments={appointments} />
			</QueryBoundary>
		</div>
	);
}
