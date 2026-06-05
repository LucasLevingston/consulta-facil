"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureRequestsApi } from "@/lib/api/procedure-requests.api";
import type { ScheduleProcedureRequestInput } from "@/lib/schemas/procedure-request/schedule-procedure-request.schema";
import { procedureRequestKeys } from "./procedure-request-keys";

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
