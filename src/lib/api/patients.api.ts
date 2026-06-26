export { patientDocumentsApi } from "./patients/patient-documents.api";
export { patientEmergencyContactsApi } from "./patients/patient-emergency-contacts.api";
export { patientHealthApi } from "./patients/patient-health.api";
export type {
	PatientSummary,
	ProfessionalPatientsParams,
} from "./patients/patient-profile.api";
export { patientProfileApi } from "./patients/patient-profile.api";
export { patientVaccinesApi } from "./patients/patient-vaccines.api";

import { patientDocumentsApi } from "./patients/patient-documents.api";
import { patientEmergencyContactsApi } from "./patients/patient-emergency-contacts.api";
import { patientHealthApi } from "./patients/patient-health.api";
import { patientProfileApi } from "./patients/patient-profile.api";
import { patientVaccinesApi } from "./patients/patient-vaccines.api";

export const patientsApi = {
	...patientProfileApi,
	...patientHealthApi,
	...patientEmergencyContactsApi,
	...patientVaccinesApi,
	...patientDocumentsApi,
};
