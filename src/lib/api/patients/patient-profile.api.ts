import { api } from "@/config/api";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";
import type { PatientProfile } from "@/lib/schemas/patient/patient-profile.schema";
import type { UpdatePatientInput } from "@/lib/schemas/patient/update-patient.schema";
import type {
	PatientSummary,
	ProfessionalPatientsParams,
} from "./patient-profile.api.types";

export type {
	PatientSummary,
	ProfessionalPatientsParams,
} from "./patient-profile.api.types";

export const patientProfileApi = {
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
};
