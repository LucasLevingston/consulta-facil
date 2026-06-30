export { dependentKeys } from "@/hooks/api/dependents/dependent-keys";
export { useCreateDependent } from "@/hooks/api/dependents/use-create-dependent";
export { useDeleteDependent } from "@/hooks/api/dependents/use-delete-dependent";
export { useMyDependents } from "@/hooks/api/dependents/use-my-dependents";
export { useUpdateDependent } from "@/hooks/api/dependents/use-update-dependent";
export { dependentsApi } from "@/lib/api/dependents/dependents.api";
export {
	type CreateDependentInput,
	createDependentSchema,
} from "@/lib/schemas/dependent/create-dependent.schema";
export type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";
