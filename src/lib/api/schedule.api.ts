export { clinicWorkingHoursApi } from "./clinics/clinic-working-hours.api";
export { professionalScheduleApi } from "./professionals/professional-schedule.api";

import { clinicWorkingHoursApi } from "./clinics/clinic-working-hours.api";
import { professionalScheduleApi } from "./professionals/professional-schedule.api";

export const scheduleApi = {
	...professionalScheduleApi,
	...clinicWorkingHoursApi,
};
