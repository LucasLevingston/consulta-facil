"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { procedureRequestsRepository } from "../repositories/procedure-requests.repository";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useGetMyProcedureRequests() {
	return useSuspenseQuery({
		queryKey: procedureRequestKeys.mine,
		queryFn: () => procedureRequestsRepository.getMine(),
	});
}
