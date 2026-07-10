"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureRequestKeys } from "@/components/procedure-requests/hooks";
import { procedureRequestsRepository } from "@/features/procedure-requests";
import type { CreateProcedureRequestInput } from "@/lib/schemas/procedure-request/create-procedure-request.schema";

export function useCreateProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProcedureRequestInput) =>
			procedureRequestsRepository.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
