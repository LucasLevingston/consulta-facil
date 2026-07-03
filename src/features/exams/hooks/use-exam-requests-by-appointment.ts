"use client";

import { useQuery } from "@tanstack/react-query";
import { examsRepository } from "../repositories/exams.repository";
import { examRequestKeys } from "./exam-request-keys";

export function useExamRequestsByAppointment(appointmentId: string) {
	return useQuery({
		queryKey: examRequestKeys.byAppointment(appointmentId),
		queryFn: () => examsRepository.getByAppointment(appointmentId),
		enabled: !!appointmentId,
	});
}
