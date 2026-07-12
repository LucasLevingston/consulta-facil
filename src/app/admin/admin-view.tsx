"use client";

import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import { PendingApplications } from "@/components/admin/PendingApplications";
import { useProfessionalAppointments } from "@/components/appointments/hooks";
import { usePermission } from "@/components/auth/hooks";
import PageHeader from "@/components/custom/page-header";
import { useAuthStore, useUserStore } from "@/features/auth";
import { QueryBoundary } from "@/providers/query-boundary";

export function AdminView() {
	const { isAuthenticated } = useAuthStore();
	const { user } = useUserStore();
	const { can } = usePermission();
	const router = useRouter();

	const professionalQuery = useProfessionalAppointments(user?.id ?? "");
	const appointments = professionalQuery.data?.content ?? [];

	useEffect(() => {
		if (!isAuthenticated || !can("admin:access")) router.push("/auth");
	}, [isAuthenticated, can, router]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Painel Administrativo"
				description="Gerencie todas as consultas da plataforma."
				icon={<BadgeCheck className="h-6 w-6" />}
				count={appointments.length}
				countLabel="consulta"
			/>

			<PendingApplications />

			<QueryBoundary
				isLoading={professionalQuery.isLoading}
				error={professionalQuery.error}
			>
				<Suspense>
					<AppointmentsDashboard appointments={appointments} />
				</Suspense>
			</QueryBoundary>
		</div>
	);
}
