import { api } from "@/config/api";
import type { ApiPage } from "@/lib/schemas/doctor.schema";
import type {
	MedicalRecord,
	PatientProfile,
	UpdateMedicalRecordInput,
	UpdatePatientInput,
} from "@/lib/schemas/patient.schema";

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
};
