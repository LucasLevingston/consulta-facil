"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProcedureRequestInput } from "@/lib/schemas/procedure-request/create-procedure-request.schema";
import { procedureRequestsRepository } from "../repositories/procedure-requests.repository";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useCreateProcedureRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProcedureRequestInput) =>
			procedureRequestsRepository.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: procedureRequestKeys.all }),
	});
}
