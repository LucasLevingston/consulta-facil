import { api } from "@/config/api";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";
import type { UpdateAddressInput } from "@/lib/schemas/professional/update-address.schema";
import type { UpdateBioInput } from "@/lib/schemas/professional/update-bio.schema";
import type { UpdateCouncilInput } from "@/lib/schemas/professional/update-council.schema";
import type { UpdateSocialLinksInput } from "@/lib/schemas/professional/update-social-links.schema";

export const professionalProfileApi = {
	update: async (
		professionalId: string,
		data: CreateProfessionalInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/${professionalId}`,
			data,
		);
		return response.data;
	},

	delete: async (professionalId: string): Promise<void> => {
		await api.delete(`/professionals/${professionalId}`);
	},

	updateBio: async (data: UpdateBioInput): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/bio",
			data,
		);
		return response.data;
	},

	updateSocialLinks: async (
		data: UpdateSocialLinksInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/social-links",
			data,
		);
		return response.data;
	},

	updateCouncil: async (
		data: UpdateCouncilInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/council",
			data,
		);
		return response.data;
	},

	updateAddress: async (
		data: UpdateAddressInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/address",
			data,
		);
		return response.data;
	},
};
