"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examRequestKeys } from "./exam-request-keys";

export function useExamRequestsByAppointment(appointmentId: string) {
	return useSuspenseQuery({
		queryKey: examRequestKeys.byAppointment(appointmentId),
		queryFn: () => examsRepository.getExamsByAppointment(appointmentId),
	});
}
