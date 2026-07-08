"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureRequestsRepository } from "../repositories/procedure-requests.repository";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useCancelProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (requestId: string) =>
			procedureRequestsRepository.cancel(requestId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
