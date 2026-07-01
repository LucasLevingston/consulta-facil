import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateDependentInput } from "@/lib/schemas/dependent/create-dependent.schema";
import { dependentsRepository } from "../repositories/dependents.repository";
import { dependentKeys } from "./dependent-keys";

export function useUpdateDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<CreateDependentInput>;
		}) => dependentsRepository.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
