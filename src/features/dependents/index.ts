export { dependentsApi } from "@/lib/api/dependents/dependents.api";
export {
	type CreateDependentInput,
	createDependentSchema,
} from "@/lib/schemas/dependent/create-dependent.schema";
export type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";
export { useDependentsController } from "./controllers/use-dependents.controller";
export { dependentsRepository } from "./repositories/dependents.repository";
export { dependentsService } from "./services/dependents.service";
