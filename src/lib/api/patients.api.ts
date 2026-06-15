import { api } from "@/config/api";
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
import type { UpdatePatientInput } from "@/lib/schemas/patient/update-patient.schema";

export interface PatientSummary {
	id: string;
	name: string;
	lastAppointment: string;
	totalAppointments: number;
}

export interface ProfessionalPatientsParams {
	page?: number;
	size?: number;
	search?: string;
	sort?: "name" | "recent";
}

export const patientsApi = {
	getMyProfile: async (): Promise<PatientProfile> => {
		const response = await api.get<PatientProfile>("/patients/me");
		return response.data;
	},

	getProfile: async (userId: string): Promise<PatientProfile> => {
		const response = await api.get<PatientProfile>(`/patients/${userId}`);
		return response.data;
	},

	updateMyProfile: async (
		data: UpdatePatientInput,
	): Promise<PatientProfile> => {
		const response = await api.put<PatientProfile>("/patients/me", data);
		return response.data;
	},

	getMedicalRecords: async (userId: string): Promise<MedicalRecord> => {
		const response = await api.get<MedicalRecord>(
			`/patients/${userId}/medical-records`,
		);
		return response.data;
	},

	updateMedicalRecords: async (
		userId: string,
		data: UpdateMedicalRecordInput,
	): Promise<MedicalRecord> => {
		const response = await api.put<MedicalRecord>(
			`/patients/${userId}/medical-records`,
			data,
		);
		return response.data;
	},

	getProfessionalPatients: async (
		professionalId: string,
		params: ProfessionalPatientsParams,
	): Promise<ApiPage<PatientSummary>> => {
		const response = await api.get<ApiPage<PatientSummary>>(
			`/patients/professional/${professionalId}`,
			{ params },
		);
		return response.data;
	},

	getAll: async (
		params: ProfessionalPatientsParams,
	): Promise<ApiPage<PatientSummary>> => {
		const response = await api.get<ApiPage<PatientSummary>>("/patients", {
			params,
		});
		return response.data;
	},

	// ── Emergency Contacts ────────────────────────────────────────────────

	listEmergencyContacts: async (): Promise<EmergencyContactInput[]> => {
		const response = await api.get<EmergencyContactInput[]>(
			"/patients/me/emergency-contacts",
		);
		return response.data;
	},

	addEmergencyContact: async (
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> => {
		const response = await api.post<EmergencyContactInput>(
			"/patients/me/emergency-contacts",
			data,
		);
		return response.data;
	},

	updateEmergencyContact: async (
		id: string,
		data: EmergencyContactInput,
	): Promise<EmergencyContactInput> => {
		const response = await api.put<EmergencyContactInput>(
			`/patients/me/emergency-contacts/${id}`,
			data,
		);
		return response.data;
	},

	deleteEmergencyContact: async (id: string): Promise<void> => {
		await api.delete(`/patients/me/emergency-contacts/${id}`);
	},

	// ── Vaccines ──────────────────────────────────────────────────────────

	listVaccines: async (): Promise<PatientVaccineResponse[]> => {
		const response = await api.get<PatientVaccineResponse[]>(
			"/patients/me/vaccines",
		);
		return response.data;
	},

	addVaccine: async (
		data: PatientVaccineInput,
	): Promise<PatientVaccineResponse> => {
		const response = await api.post<PatientVaccineResponse>(
			"/patients/me/vaccines",
			data,
		);
		return response.data;
	},

	deleteVaccine: async (id: string): Promise<void> => {
		await api.delete(`/patients/me/vaccines/${id}`);
	},

	// ── Documents ─────────────────────────────────────────────────────────

	listDocuments: async (): Promise<PatientDocumentResponse[]> => {
		const response = await api.get<PatientDocumentResponse[]>(
			"/patients/me/documents",
		);
		return response.data;
	},

	uploadDocument: async (
		file: File,
		documentType: DocumentType,
		documentLabel?: string,
	): Promise<PatientDocumentResponse> => {
		const form = new FormData();
		form.append("file", file);
		form.append("documentType", documentType);
		if (documentLabel) form.append("documentLabel", documentLabel);
		const response = await api.post<PatientDocumentResponse>(
			"/patients/me/documents",
			form,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
		return response.data;
	},

	deleteDocument: async (id: string): Promise<void> => {
		await api.delete(`/patients/me/documents/${id}`);
	},
};
