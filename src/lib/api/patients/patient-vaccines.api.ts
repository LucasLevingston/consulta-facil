import { api } from "@/config/api";
import type {
	PatientVaccineInput,
	PatientVaccineResponse,
} from "@/lib/schemas/patient/patient-vaccine.schema";

export const patientVaccinesApi = {
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
};
