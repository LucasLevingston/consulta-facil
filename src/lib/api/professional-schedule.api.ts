import { api } from "@/config/api";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";
import type { ProfessionalScheduleResponse } from "@/lib/schemas/schedule/professional-schedule-response.schema";

export const professionalScheduleApi = {
	getMySchedule: async (): Promise<ProfessionalScheduleResponse[]> => {
		const response = await api.get<ProfessionalScheduleResponse[]>(
			"/professionals/me/schedule",
		);
		return response.data;
	},

	getScheduleByProfessional: async (
		professionalId: string,
	): Promise<ProfessionalScheduleResponse[]> => {
		const response = await api.get<ProfessionalScheduleResponse[]>(
			`/professionals/${professionalId}/schedule`,
		);
		return response.data;
	},

	saveMySchedule: async (
		items: ProfessionalScheduleItem[],
	): Promise<ProfessionalScheduleResponse[]> => {
		const response = await api.put<ProfessionalScheduleResponse[]>(
			"/professionals/me/schedule",
			items,
		);
		return response.data;
	},
};
