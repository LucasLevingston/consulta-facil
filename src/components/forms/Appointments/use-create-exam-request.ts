"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examRequestKeys } from "@/components/exams/hooks";
import { examsRepository } from "@/features/exams";
import type { CreateExamRequestInput } from "@/lib/schemas/examRequest/create-exam-request.schema";

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
