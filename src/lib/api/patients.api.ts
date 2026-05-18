import { api } from "@/config/api";
import type {
  MedicalRecord,
  PatientProfile,
  UpdateMedicalRecordInput,
  UpdatePatientInput,
} from "@/lib/schemas/patient.schema";

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
};
