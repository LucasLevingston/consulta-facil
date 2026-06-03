"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { examRequestApi } from "@/lib/api/examRequest.api";
import type { CreateExamRequestInput } from "@/lib/schemas/examRequest.schema";
import { examRequestKeys } from "./exam-request-keys";

export function useCreateExamRequest(appointmentId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateExamRequestInput) =>
			examRequestApi.create(appointmentId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: examRequestKeys.byAppointment(appointmentId),
			}),
	});
}
