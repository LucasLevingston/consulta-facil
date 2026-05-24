"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { examRequestApi } from "@/lib/api/examRequest.api";
import type {
	CreateExamRequestInput,
	ReviewExamRequestInput,
} from "@/lib/schemas/examRequest.schema";

export const examRequestKeys = {
	all: ["examRequests"] as const,
	byAppointment: (appointmentId: string) =>
		[...examRequestKeys.all, "appointment", appointmentId] as const,
};

export function useExamRequestsByAppointment(appointmentId: string) {
	return useQuery({
		queryKey: examRequestKeys.byAppointment(appointmentId),
		queryFn: () => examRequestApi.getByAppointment(appointmentId),
		enabled: !!appointmentId,
	});
}

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

export function useUploadExamResult() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ examId, file }: { examId: string; file: File }) =>
			examRequestApi.upload(examId, file),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all }),
	});
}

export function useReviewExam() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			examId,
			data,
		}: { examId: string; data: ReviewExamRequestInput }) =>
			examRequestApi.review(examId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: examRequestKeys.all }),
	});
}
