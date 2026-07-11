"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { examRequestKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";

export function useExamRequestsByAppointment(appointmentId: string) {
	return useSuspenseQuery({
		queryKey: examRequestKeys.byAppointment(appointmentId),
		queryFn: () => examsRepository.getExamsByAppointment(appointmentId),
	});
}
