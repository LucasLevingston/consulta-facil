import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dependentsRepository } from "../repositories/dependents.repository";
import { dependentKeys } from "./dependent-keys";

export function useCreateDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: dependentsRepository.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
