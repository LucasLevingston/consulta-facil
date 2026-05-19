import { api } from "@/config/api";
import type { ApiPage, CreateDoctorInput, DoctorResponse } from "@/lib/schemas/doctor.schema";



export const doctorsApi = {
  getAll: async (page = 0, size = 20): Promise<ApiPage<DoctorResponse>> => {
    const response = await api.get<ApiPage<DoctorResponse>>("/doctors", {
      params: { page, size },
    });
    return response.data;
  },

  getById: async (doctorId: string): Promise<DoctorResponse> => {
    const response = await api.get<DoctorResponse>(`/doctors/${doctorId}`);
    return response.data;
  },

  searchBySpecialty: async (
    specialty: string,
    page = 0,
    size = 20
  ): Promise<ApiPage<DoctorResponse>> => {
    const response = await api.get<ApiPage<DoctorResponse>>("/doctors/search", {
      params: { specialty, page, size },
    });
    return response.data;
  },

  create: async (data: CreateDoctorInput): Promise<DoctorResponse> => {
    const response = await api.post<DoctorResponse>("/doctors", data);
    return response.data;
  },

  update: async (doctorId: string, data: CreateDoctorInput): Promise<DoctorResponse> => {
    const response = await api.put<DoctorResponse>(`/doctors/${doctorId}`, data);
    return response.data;
  },

  delete: async (doctorId: string): Promise<void> => {
    await api.delete(`/doctors/${doctorId}`);
  },

  getPendingApplications: async (page = 0, size = 20): Promise<ApiPage<DoctorResponse>> => {
    const response = await api.get<ApiPage<DoctorResponse>>("/doctors/applications", {
      params: { page, size },
    });
    return response.data;
  },

  getApplicationStatus: async (): Promise<DoctorResponse> => {
    const response = await api.get<DoctorResponse>("/doctors/application-status");
    return response.data;
  },

  approve: async (doctorId: string): Promise<DoctorResponse> => {
    const response = await api.put<DoctorResponse>(`/doctors/${doctorId}/approve`);
    return response.data;
  },

  reject: async (doctorId: string): Promise<DoctorResponse> => {
    const response = await api.put<DoctorResponse>(`/doctors/${doctorId}/reject`);
    return response.data;
  },

  getNearby: async (
    lat: number,
    lng: number,
    radiusKm = 50,
    specialty?: string
  ): Promise<DoctorResponse[]> => {
    const response = await api.get<DoctorResponse[]>("/doctors/nearby", {
      params: { lat, lng, radiusKm, specialty },
    });
    return response.data;
  },
};
