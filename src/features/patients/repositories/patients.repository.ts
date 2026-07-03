import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import {
	type ProfessionalPatientsParams,
	patientProfileApi,
} from "@/lib/api/patients/patient-profile.api";
import type { PatientSummary } from "@/lib/api/patients/patient-profile.api.types";
import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";
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

export const patientsRepository = {
	getMyProfile: async (): Promise<PatientProfile> =>
		patientProfileApi.getMyProfile(),

	getProfile: async (userId: string): Promise<PatientProfile> =>
		patientProfileApi.getProfile(userId),

	updateMyProfile: async (
		data: Record<string, unknown>,
	): Promise<PatientProfile> => patientProfileApi.updateMyProfile(data),

	getProfessionalPatients: async (
		professionalId: string,
		params: ProfessionalPatientsParams,
	): Promise<ApiPage<PatientSummary>> =>
		patientProfileApi.getProfessionalPatients(professionalId, params),

	getAll: async (
		params: ProfessionalPatientsParams,
	): Promise<ApiPage<PatientSummary>> => patientProfileApi.getAll(params),

	getMedicalRecords: async (userId: string): Promise<MedicalRecord> =>
		patientHealthApi.getMedicalRecords(userId),

	updateMedicalRecords: async (
		userId: string,
		data: UpdateMedicalRecordInput,
	): Promise<MedicalRecord> =>
		patientHealthApi.updateMedicalRecords(userId, data),

	listEmergencyContacts: async (): Promise<EmergencyContactInput[]> =>
		patientEmergencyContactsApi.listEmergencyContacts(),

	addEmergencyContact: async (
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> =>
		patientEmergencyContactsApi.addEmergencyContact(data),

	updateEmergencyContact: async (
		id: string,
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> =>
		patientEmergencyContactsApi.updateEmergencyContact(id, data),

	deleteEmergencyContact: async (id: string): Promise<void> =>
		patientEmergencyContactsApi.deleteEmergencyContact(id),

	listVaccines: async (): Promise<PatientVaccineResponse[]> =>
		patientVaccinesApi.listVaccines(),

	addVaccine: async (
		data: PatientVaccineInput,
	): Promise<PatientVaccineResponse> => patientVaccinesApi.addVaccine(data),

	deleteVaccine: async (id: string): Promise<void> =>
		patientVaccinesApi.deleteVaccine(id),

	listDocuments: async (): Promise<PatientDocumentResponse[]> =>
		patientDocumentsApi.listDocuments(),

	uploadDocument: async (
		file: File,
		documentType: DocumentType,
		documentLabel?: string,
	): Promise<PatientDocumentResponse> =>
		patientDocumentsApi.uploadDocument(file, documentType, documentLabel),

	deleteDocument: async (id: string): Promise<void> =>
		patientDocumentsApi.deleteDocument(id),
};
