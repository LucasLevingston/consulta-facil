"use client";

import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import PageHeader from "@/components/custom/page-header";
import { useDoctorAppointments } from "@/hooks/api/use-appointments";
import { QueryBoundary } from "@/providers/query-boundary";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

export default function AdminPage() {
	const { isAuthenticated } = useAuthStore();
	const { user } = useUserStore();
	const router = useRouter();

	const doctorQuery = useDoctorAppointments(user?.id ?? "");
	const appointments = doctorQuery.data?.content ?? [];

	useEffect(() => {
		if (!isAuthenticated || user?.role !== "ADMIN") router.push("/auth");
	}, [isAuthenticated, user?.role, router]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Painel Administrativo"
				description="Gerencie todas as consultas da plataforma."
				icon={<BadgeCheck className="h-6 w-6" />}
				count={appointments.length}
				countLabel="consulta"
			/>

			<QueryBoundary
				isLoading={doctorQuery.isLoading}
				error={doctorQuery.error}
			>
				<AppointmentsDashboard appointments={appointments} userRole="ADMIN" />
			</QueryBoundary>
		</div>
	);
}
