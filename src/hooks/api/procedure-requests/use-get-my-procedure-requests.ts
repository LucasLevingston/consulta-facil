"use client";

import { useQuery } from "@tanstack/react-query";
import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useGetMyProcedureRequests() {
	return useQuery({
		queryKey: procedureRequestKeys.mine,
		queryFn: () => procedureRequestsApi.getMine(),
	});
}
