import { appointmentsClinicalRepo } from "./appointments-clinical.repository";
import { appointmentsCrudRepo } from "./appointments-crud.repository";

export const appointmentsRepository = {
	...appointmentsCrudRepo,
	...appointmentsClinicalRepo,
};
