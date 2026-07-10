"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureRequestKeys } from "@/components/procedure-requests/hooks";
import { procedureRequestsRepository } from "@/features/procedure-requests";
import type { ScheduleProcedureRequestInput } from "@/lib/schemas/procedure-request/schedule-procedure-request.schema";

export function useScheduleProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			requestId,
			data,
		}: {
			requestId: string;
			data: ScheduleProcedureRequestInput;
		}) => procedureRequestsRepository.schedule(requestId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
