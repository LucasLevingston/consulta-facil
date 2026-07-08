import { clinicWorkingHoursApi } from "@/lib/api/clinics/clinic-working-hours.api";
import { professionalScheduleApi } from "@/lib/api/professionals/professional-schedule.api";
import type { ClinicWorkingHoursItem } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import type { ClinicWorkingHoursResponse } from "@/lib/schemas/schedule/clinic-working-hours-response.schema";
import type { ProfessionalScheduleItem } from "@/lib/schemas/schedule/professional-schedule-item.schema";
import type { ProfessionalScheduleResponse } from "@/lib/schemas/schedule/professional-schedule-response.schema";

export const scheduleRepository = {
	getMySchedule: (): Promise<ProfessionalScheduleResponse[]> =>
		professionalScheduleApi.getMySchedule(),

	getScheduleByProfessional: (
		professionalId: string,
	): Promise<ProfessionalScheduleResponse[]> =>
		professionalScheduleApi.getScheduleByProfessional(professionalId),

	saveMySchedule: (
		items: ProfessionalScheduleItem[],
	): Promise<ProfessionalScheduleResponse[]> =>
		professionalScheduleApi.saveMySchedule(items),

	getClinicWorkingHours: (
		clinicId: string,
	): Promise<ClinicWorkingHoursResponse[]> =>
		clinicWorkingHoursApi.getClinicWorkingHours(clinicId),

	saveClinicWorkingHours: (
		clinicId: string,
		items: ClinicWorkingHoursItem[],
	): Promise<ClinicWorkingHoursResponse[]> =>
		clinicWorkingHoursApi.saveClinicWorkingHours(clinicId, items),
};
