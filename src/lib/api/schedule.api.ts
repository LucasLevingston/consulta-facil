import { api } from "@/config/api";
import type { ClinicWorkingHoursItem } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import type { ClinicWorkingHoursResponse } from "@/lib/schemas/schedule/clinic-working-hours-response.schema";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";
import type { ProfessionalScheduleResponse } from "@/lib/schemas/schedule/professional-schedule-response.schema";

export const scheduleApi = {
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
