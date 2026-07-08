import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import type {
	PatientSummary,
	ProfessionalPatientsParams,
} from "@/lib/api/patients/patient-profile.api.types";
import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";
import type { EmergencyContactInput } from "@/lib/schemas/patient/emergency-contact.schema";
import type { MedicalRecord } from "@/lib/schemas/patient/medical-record.schema";
import type {
	DocumentType,
	PatientDocumentResponse,
} from "@/lib/schemas/patient/patient-document.schema";
import type { PatientProfile } from "@/lib/schemas/patient/patient-profile.schema";
import type {
	PatientVaccineInput,
	PatientVaccineResponse,
} from "@/lib/schemas/patient/patient-vaccine.schema";
import type { UpdateMedicalRecordInput } from "@/lib/schemas/patient/update-medical-record.schema";
import type { UpdatePatientInput } from "@/lib/schemas/patient/update-patient.schema";
import type { ApiPage } from "@/lib/schemas/professional/api-page.schema";

export const patientsRepository = {
	getMyProfile: (): Promise<PatientProfile> => patientProfileApi.getMyProfile(),

	getProfile: (userId: string): Promise<PatientProfile> =>
		patientProfileApi.getProfile(userId),

	updateMyProfile: (data: UpdatePatientInput): Promise<PatientProfile> =>
		patientProfileApi.updateMyProfile(data),

	getProfessionalPatients: (
		professionalId: string,
		params: ProfessionalPatientsParams,
	): Promise<ApiPage<PatientSummary>> =>
		patientProfileApi.getProfessionalPatients(professionalId, params),

	getAllPatients: (
		params: ProfessionalPatientsParams,
	): Promise<ApiPage<PatientSummary>> => patientProfileApi.getAll(params),

	getMedicalRecords: (userId: string): Promise<MedicalRecord> =>
		patientHealthApi.getMedicalRecords(userId),

	updateMedicalRecords: (
		userId: string,
		data: UpdateMedicalRecordInput,
	): Promise<MedicalRecord> =>
		patientHealthApi.updateMedicalRecords(userId, data),

	listEmergencyContacts: (): Promise<EmergencyContactInput[]> =>
		patientEmergencyContactsApi.listEmergencyContacts(),

	addEmergencyContact: (
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> =>
		patientEmergencyContactsApi.addEmergencyContact(data),

	updateEmergencyContact: (
		id: string,
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> =>
		patientEmergencyContactsApi.updateEmergencyContact(id, data),

	deleteEmergencyContact: (id: string): Promise<void> =>
		patientEmergencyContactsApi.deleteEmergencyContact(id),

	listVaccines: (): Promise<PatientVaccineResponse[]> =>
		patientVaccinesApi.listVaccines(),

	addVaccine: (data: PatientVaccineInput): Promise<PatientVaccineResponse> =>
		patientVaccinesApi.addVaccine(data),

	deleteVaccine: (id: string): Promise<void> =>
		patientVaccinesApi.deleteVaccine(id),

	listDocuments: (): Promise<PatientDocumentResponse[]> =>
		patientDocumentsApi.listDocuments(),

	uploadDocument: (
		file: File,
		documentType: DocumentType,
		documentLabel?: string,
	): Promise<PatientDocumentResponse> =>
		patientDocumentsApi.uploadDocument(file, documentType, documentLabel),

	deleteDocument: (id: string): Promise<void> =>
		patientDocumentsApi.deleteDocument(id),
};
