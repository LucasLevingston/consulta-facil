import { api } from "@/config/api";
import type { ClinicWorkingHoursItem } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import type { ClinicWorkingHoursResponse } from "@/lib/schemas/schedule/clinic-working-hours-response.schema";

export const clinicWorkingHoursApi = {
	getClinicWorkingHours: async (
		clinicId: string,
	): Promise<ClinicWorkingHoursResponse[]> => {
		const response = await api.get<ClinicWorkingHoursResponse[]>(
			`/clinics/${clinicId}/working-hours`,
		);
		return response.data;
	},

	saveClinicWorkingHours: async (
		clinicId: string,
		items: ClinicWorkingHoursItem[],
	): Promise<ClinicWorkingHoursResponse[]> => {
		const response = await api.put<ClinicWorkingHoursResponse[]>(
			`/clinics/${clinicId}/working-hours`,
			items,
		);
		return response.data;
	},
};
