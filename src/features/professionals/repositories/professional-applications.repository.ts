import { getMyProfessionalProfileApi } from "@/lib/api/professionals/my-professional-profile.api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import type { ApiPage } from "@/lib/schemas/professional/api-page.schema";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";

export const professionalApplicationsRepository = {
	create: (data: CreateProfessionalInput): Promise<ProfessionalResponse> =>
		professionalApplicationsApi.create(data),

	getPendingApplications: (
		page = 0,
		size = 20,
	): Promise<ApiPage<ProfessionalResponse>> =>
		professionalApplicationsApi.getPendingApplications(page, size),

	getApplicationStatus: (): Promise<ProfessionalResponse> =>
		professionalApplicationsApi.getApplicationStatus(),

	approve: (professionalId: string): Promise<ProfessionalResponse> =>
		professionalApplicationsApi.approve(professionalId),

	reject: (professionalId: string): Promise<ProfessionalResponse> =>
		professionalApplicationsApi.reject(professionalId),

	getMyProfile: (): Promise<ProfessionalResponse> =>
		getMyProfessionalProfileApi(),
};
