"use client";

import { useParams } from "next/navigation";

import { AppointmentDetail } from "@/components/appointments/detail/AppointmentDetail";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { useAppointment } from "./use-appointment";

function AppointmentDetailBody({ id }: { id: string }) {
	const { data } = useAppointment(id);
	return <AppointmentDetail appointment={data} />;
}

export function AppointmentDetailView() {
	const { id } = useParams<{ id: string }>();

	return (
		<SuspenseBoundary>
			<AppointmentDetailBody id={id} />
		</SuspenseBoundary>
	);
}
