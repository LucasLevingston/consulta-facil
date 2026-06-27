import { api } from "@/config/api";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor/create-professional.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import type { UpdateAddressInput } from "@/lib/schemas/doctor/update-address.schema";
import type { UpdateBioInput } from "@/lib/schemas/doctor/update-bio.schema";
import type { UpdateCouncilInput } from "@/lib/schemas/doctor/update-council.schema";
import type { UpdateSocialLinksInput } from "@/lib/schemas/doctor/update-social-links.schema";

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
