"use client";

import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import { PendingApplications } from "@/components/admin/PendingApplications";
import PageHeader from "@/components/custom/page-header";
import { useProfessionalAppointments } from "@/features/appointments";
import { useAuthStore, usePermission, useUserStore } from "@/features/auth";
import { QueryBoundary } from "@/providers/query-boundary";

export default function AdminPage() {
	const { isAuthenticated } = useAuthStore();
	const { user } = useUserStore();
	const { can } = usePermission();
	const router = useRouter();

	const doctorQuery = useProfessionalAppointments(user?.id ?? "");
	const appointments = doctorQuery.data?.content ?? [];

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
				isLoading={doctorQuery.isLoading}
				error={doctorQuery.error}
			>
				<Suspense>
					<AppointmentsDashboard appointments={appointments} />
				</Suspense>
			</QueryBoundary>
		</div>
	);
}
