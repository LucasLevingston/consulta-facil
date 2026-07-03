"use client";

import { useQuery } from "@tanstack/react-query";
import { procedureRequestsRepository } from "../repositories/procedure-requests.repository";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useGetMyProcedureRequests() {
	return useQuery({
		queryKey: procedureRequestKeys.mine,
		queryFn: procedureRequestsRepository.getMine,
	});
}
