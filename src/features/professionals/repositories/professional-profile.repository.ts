import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";
import type { UpdateAddressInput } from "@/lib/schemas/professional/update-address.schema";
import type { UpdateBioInput } from "@/lib/schemas/professional/update-bio.schema";
import type { UpdateCouncilInput } from "@/lib/schemas/professional/update-council.schema";
import type { UpdateSocialLinksInput } from "@/lib/schemas/professional/update-social-links.schema";

export const professionalProfileRepository = {
	update: (
		professionalId: string,
		data: CreateProfessionalInput,
	): Promise<ProfessionalResponse> =>
		professionalProfileApi.update(professionalId, data),

	delete: (professionalId: string): Promise<void> =>
		professionalProfileApi.delete(professionalId),

	updateBio: (data: UpdateBioInput): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateBio(data),

	updateSocialLinks: (
		data: UpdateSocialLinksInput,
	): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateSocialLinks(data),

	updateCouncil: (data: UpdateCouncilInput): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateCouncil(data),

	updateAddress: (data: UpdateAddressInput): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateAddress(data),
};
