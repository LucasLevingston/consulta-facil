"use client";

import { useQuery } from "@tanstack/react-query";

import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";
import { examRequestKeys } from "./exam-request-keys";

export function useExamRequestsByAppointment(appointmentId: string) {
	return useQuery({
		queryKey: examRequestKeys.byAppointment(appointmentId),
		queryFn: () => examRequestApi.getByAppointment(appointmentId),
		enabled: !!appointmentId,
	});
}
