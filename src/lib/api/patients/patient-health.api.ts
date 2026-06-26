import { api } from "@/config/api";
import type { MedicalRecord } from "@/lib/schemas/patient/medical-record.schema";
import type { UpdateMedicalRecordInput } from "@/lib/schemas/patient/update-medical-record.schema";

export const patientHealthApi = {
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
};
