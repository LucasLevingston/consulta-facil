"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateExamRequestInput } from "@/lib/schemas/examRequest/create-exam-request.schema";
import { examsRepository } from "../repositories/exams.repository";
import { examRequestKeys } from "./exam-request-keys";

export function useCreateExamRequest(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateExamRequestInput) =>
			examsRepository.createExamRequest(appointmentId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: examRequestKeys.byAppointment(appointmentId),
			}),
	});
}
