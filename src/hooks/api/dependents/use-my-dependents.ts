import { useQuery } from "@tanstack/react-query";
import { dependentsApi } from "@/lib/api/dependents/dependents.api";
import { dependentKeys } from "./dependent-keys";

export function useMyDependents() {
	return useQuery({
		queryKey: dependentKeys.my(),
		queryFn: dependentsApi.getMy,
		staleTime: 5 * 60 * 1000,
	});
}
