export { useDependentForm } from "@/features/dependents/hooks/use-dependent-form";
export { useDependentsPage } from "@/features/dependents/hooks/use-dependents-page";
export { dependentsApi } from "@/lib/api/dependents/dependents.api";
export {
	type CreateDependentInput,
	createDependentSchema,
} from "@/lib/schemas/dependent/create-dependent.schema";
export type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";
export { useDependentsController } from "./controllers/use-dependents.controller";
export { dependentKeys } from "./hooks/dependent-keys";
export { useCreateDependent } from "./hooks/use-create-dependent";
export { useDeleteDependent } from "./hooks/use-delete-dependent";
export { useMyDependents } from "./hooks/use-my-dependents";
export { useUpdateDependent } from "./hooks/use-update-dependent";
export { dependentsRepository } from "./repositories/dependents.repository";
export { dependentsService } from "./services/dependents.service";
