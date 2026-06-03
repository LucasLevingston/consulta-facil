"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureRequestsApi } from "@/lib/api/procedure-requests.api";
import type { CreateProcedureRequestInput } from "@/lib/schemas/procedure-request.schema";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useCreateProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProcedureRequestInput) =>
			procedureRequestsApi.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
