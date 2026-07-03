import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dependentsRepository } from "../repositories/dependents.repository";
import { dependentKeys } from "./dependent-keys";

export function useDeleteDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => dependentsRepository.remove(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
