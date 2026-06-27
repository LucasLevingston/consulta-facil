export { clinicQueueApi } from "./clinics/clinic-queue.api";
export { clinicStaffApi } from "./clinics/clinic-staff.api";
export { clinicsCrudApi } from "./clinics/clinics.api";

import { clinicQueueApi } from "./clinics/clinic-queue.api";
import { clinicStaffApi } from "./clinics/clinic-staff.api";
import { clinicsCrudApi } from "./clinics/clinics.api";

export const clinicsApi = {
	...clinicsCrudApi,
	...clinicStaffApi,
	...clinicQueueApi,
};
