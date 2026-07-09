import { useMemo } from "react";
import { useAllAdminAppointments } from "@/features/appointments";
import { useAllUsers } from "@/features/users";

export function useUsageStats() {
	const appointmentsQuery = useAllAdminAppointments(0, 1000);
	const { data: usersData } = useAllUsers(0, 1000);

	const appointments = appointmentsQuery.data?.content ?? [];
	const totalUsers = usersData.totalElements;

	const stats = useMemo(() => {
		const totalAppointments = appointmentsQuery.data?.totalElements ?? 0;
		const completed = appointments.filter(
			(a) => a.status === "COMPLETED",
		).length;
		const pending = appointments.filter((a) => a.status === "PENDING").length;
		const cancelled = appointments.filter(
			(a) => a.status === "CANCELED",
		).length;

		const totalRevenue = appointments
			.filter((a) => a.paymentStatus === "PAID")
			.reduce((sum, a) => sum + (a.paymentAmount ?? 0), 0);

		const avgTicket =
			completed > 0
				? appointments
						.filter((a) => a.status === "COMPLETED" && a.paymentAmount)
						.reduce((sum, a) => sum + (a.paymentAmount ?? 0), 0) / completed
				: 0;

		const professionals = new Set(
			appointments.map((a) => a.professionalName).filter(Boolean),
		).size;

		return {
			totalAppointments,
			completed,
			pending,
			cancelled,
			totalRevenue,
			avgTicket,
			professionals,
		};
	}, [appointments, appointmentsQuery.data?.totalElements]);

	return {
		totalUsers,
		stats,
		isLoading: appointmentsQuery.isLoading,
		error: appointmentsQuery.error,
		refetch: appointmentsQuery.refetch,
	};
}
