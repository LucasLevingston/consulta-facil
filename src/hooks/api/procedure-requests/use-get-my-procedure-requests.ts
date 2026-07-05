"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";
import { procedureRequestKeys } from "./procedure-request-keys";

export function useGetMyProcedureRequests() {
	return useSuspenseQuery({
		queryKey: procedureRequestKeys.mine,
		queryFn: () => procedureRequestsApi.getMine(),
	});
}
