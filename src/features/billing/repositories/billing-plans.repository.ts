import { type CreatePlanValues, plansApi } from "@/lib/api/billing/plans.api";
import type { PlanResponse } from "@/lib/api/billing/plans.api.types";

export const billingPlansRepository = {
	getActivePlans: async (): Promise<PlanResponse[]> => plansApi.getActive(),
	adminListPlans: async (): Promise<PlanResponse[]> => plansApi.adminListAll(),
	adminCreatePlan: async (data: CreatePlanValues): Promise<PlanResponse> =>
		plansApi.adminCreate(data),
	adminDeactivatePlan: async (id: string): Promise<void> =>
		plansApi.adminDeactivate(id),
};
