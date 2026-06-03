"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureRequestsApi } from "@/lib/api/procedure-requests.api";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useCancelProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (requestId: string) => procedureRequestsApi.cancel(requestId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
