export { appointmentCheckinApi } from "./appointments/appointment-checkin.api";
export { appointmentLifecycleApi } from "./appointments/appointment-lifecycle.api";
export { appointmentPaymentApi } from "./appointments/appointment-payment.api";
export { appointmentRatingsApi } from "./appointments/appointment-ratings.api";
export { appointmentVideoApi } from "./appointments/appointment-video.api";
export { appointmentsCrudApi } from "./appointments/appointments.api";

import { appointmentCheckinApi } from "./appointments/appointment-checkin.api";
import { appointmentLifecycleApi } from "./appointments/appointment-lifecycle.api";
import { appointmentPaymentApi } from "./appointments/appointment-payment.api";
import { appointmentRatingsApi } from "./appointments/appointment-ratings.api";
import { appointmentVideoApi } from "./appointments/appointment-video.api";
import { appointmentsCrudApi } from "./appointments/appointments.api";

export const appointmentsApi = {
	...appointmentsCrudApi,
	...appointmentLifecycleApi,
	...appointmentCheckinApi,
	...appointmentPaymentApi,
	...appointmentVideoApi,
	...appointmentRatingsApi,
};
