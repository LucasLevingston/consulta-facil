"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { procedureRequestsApi } from "@/lib/api/procedure-requests.api";
import type {
	CreateProcedureRequestInput,
	ScheduleProcedureRequestInput,
} from "@/lib/schemas/procedure-request.schema";

export const procedureRequestKeys = {
	all: ["procedure-requests"] as const,
	mine: ["procedure-requests", "mine"] as const,
};

export function useGetMyProcedureRequests() {
	return useQuery({
		queryKey: procedureRequestKeys.mine,
		queryFn: () => procedureRequestsApi.getMine(),
	});
}

export function useCreateProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProcedureRequestInput) =>
			procedureRequestsApi.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}

export function useScheduleProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			requestId,
			data,
		}: {
			requestId: string;
			data: ScheduleProcedureRequestInput;
		}) => procedureRequestsApi.schedule(requestId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}

export function useCancelProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (requestId: string) => procedureRequestsApi.cancel(requestId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
