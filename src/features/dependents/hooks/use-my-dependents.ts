import { useQuery } from "@tanstack/react-query";
import { dependentsRepository } from "../repositories/dependents.repository";
import { dependentKeys } from "./dependent-keys";

export function useMyDependents() {
	return useQuery({
		queryKey: dependentKeys.my(),
		queryFn: dependentsRepository.getMy,
		staleTime: 5 * 60 * 1000,
	});
}
