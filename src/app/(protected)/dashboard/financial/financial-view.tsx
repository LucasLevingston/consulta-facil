"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/custom/error-boundary/error-boundary";
import PageHeader from "@/components/custom/page-header";
import { FinancialContent } from "@/components/financial/FinancialContent";
import { useMyProfessionalProfile } from "@/components/professionals/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useAllAdminAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { usePermission } from "@/features/auth";
import { QueryBoundary } from "@/providers/query-boundary";

export function FinancialView() {
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
				<QueryErrorResetBoundary>
					{({ reset }) => (
						<ErrorBoundary onReset={reset}>
							<Suspense
								fallback={<Skeleton className="h-64 w-full rounded-2xl" />}
							>
								<FinancialContent appointments={appointments} />
							</Suspense>
						</ErrorBoundary>
					)}
				</QueryErrorResetBoundary>
			</QueryBoundary>
		</div>
	);
}
