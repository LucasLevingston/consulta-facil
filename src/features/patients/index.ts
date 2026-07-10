export { patientsRepository } from "@/features/patients/repositories/patients.repository";
export { getBmiLabel } from "@/features/patients/services/bmi.service";
export type {
	PatientSummary,
	ProfessionalPatientsParams,
} from "@/lib/api/patients/patient-profile.api.types";
export {
	type EmergencyContactInput,
	emergencyContactSchema,
	RELATIONSHIP_LABELS,
} from "@/lib/schemas/patient/emergency-contact.schema";
export type { MedicalRecord } from "@/lib/schemas/patient/medical-record.schema";
export {
	DOCUMENT_TYPE_LABELS,
	type DocumentType,
	documentTypeSchema,
	type PatientDocumentResponse,
} from "@/lib/schemas/patient/patient-document.schema";
export type { PatientProfile } from "@/lib/schemas/patient/patient-profile.schema";
export {
	type PatientVaccineInput,
	type PatientVaccineResponse,
	patientVaccineSchema,
} from "@/lib/schemas/patient/patient-vaccine.schema";
export {
	type UpdateMedicalRecordInput,
	updateMedicalRecordSchema,
} from "@/lib/schemas/patient/update-medical-record.schema";
