import { useSuspenseQuery } from "@tanstack/react-query";
import { dependentsRepository } from "@/features/dependents";
import { dependentKeys } from "./dependent-keys";

export function useMyDependents() {
	return useSuspenseQuery({
		queryKey: dependentKeys.my(),
		queryFn: dependentsRepository.getMy,
		staleTime: 5 * 60 * 1000,
	});
}
