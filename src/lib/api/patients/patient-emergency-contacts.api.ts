import { api } from "@/config/api";
import type { EmergencyContactInput } from "@/lib/schemas/patient/emergency-contact.schema";

export const patientEmergencyContactsApi = {
	listEmergencyContacts: async (): Promise<EmergencyContactInput[]> => {
		const response = await api.get<EmergencyContactInput[]>(
			"/patients/me/emergency-contacts",
		);
		return response.data;
	},

	addEmergencyContact: async (
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> => {
		const response = await api.post<EmergencyContactInput>(
			"/patients/me/emergency-contacts",
			data,
		);
		return response.data;
	},

	updateEmergencyContact: async (
		id: string,
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> => {
		const response = await api.put<EmergencyContactInput>(
			`/patients/me/emergency-contacts/${id}`,
			data,
		);
		return response.data;
	},

	deleteEmergencyContact: async (id: string): Promise<void> => {
		await api.delete(`/patients/me/emergency-contacts/${id}`);
	},
};
