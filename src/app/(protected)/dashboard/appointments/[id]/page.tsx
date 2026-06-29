"use client";

import { use } from "react";

import { AppointmentDetail } from "@/components/appointments/detail/AppointmentDetail";
import { useAppointment } from "@/features/appointments";
import { QueryBoundary } from "@/providers/query-boundary";

export default function AppointmentDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data, isLoading, error } = useAppointment(id);

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{data && <AppointmentDetail appointment={data} />}
		</QueryBoundary>
	);
}
