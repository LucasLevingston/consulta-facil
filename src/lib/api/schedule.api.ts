export { clinicWorkingHoursApi } from "./clinic-working-hours.api";
export { professionalScheduleApi } from "./professional-schedule.api";

import { clinicWorkingHoursApi } from "./clinic-working-hours.api";
import { professionalScheduleApi } from "./professional-schedule.api";

export const scheduleApi = {
	...professionalScheduleApi,
	...clinicWorkingHoursApi,
};
