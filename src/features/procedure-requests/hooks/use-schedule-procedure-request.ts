"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ScheduleProcedureRequestInput } from "@/lib/schemas/procedure-request/schedule-procedure-request.schema";
import { procedureRequestsRepository } from "../repositories/procedure-requests.repository";
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
		}) => procedureRequestsRepository.schedule(requestId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
