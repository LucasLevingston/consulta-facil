import { api } from "@/config/api";
import type { InviteReceptionistInput } from "@/lib/schemas/clinic/invite-receptionist.schema";
import type { ReceptionistResponse } from "@/lib/schemas/clinic/receptionist-response.schema";

export const clinicStaffApi = {
	getReceptionists: async (
		clinicId: string,
	): Promise<ReceptionistResponse[]> => {
		const response = await api.get<ReceptionistResponse[]>(
			`/clinics/${clinicId}/receptionists`,
		);
		return response.data;
	},

	inviteReceptionist: async (
		clinicId: string,
		data: InviteReceptionistInput,
	): Promise<ReceptionistResponse> => {
		const response = await api.post<ReceptionistResponse>(
			`/clinics/${clinicId}/receptionists`,
			data,
		);
		return response.data;
	},

	removeReceptionist: async (
		clinicId: string,
		receptionistId: string,
	): Promise<void> => {
		await api.delete(`/clinics/${clinicId}/receptionists/${receptionistId}`);
	},
};
