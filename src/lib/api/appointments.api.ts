import { api } from "@/config/api";
import type {
  AppointmentResponse,
  CancelAppointmentInput,
  CreateAppointmentInput,
  RateAppointmentInput,
} from "@/lib/schemas/appointment.schema";
import type { ApiPage } from "@/lib/schemas/doctor.schema";

export const appointmentsApi = {
  schedule: async (
    data: CreateAppointmentInput,
  ): Promise<AppointmentResponse> => {
    const response = await api.post<AppointmentResponse>("/appointments", data);

    return response.data;
  },

  getById: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.get<AppointmentResponse>(`/appointments/${id}`);
    return response.data;
  },

  getByPatient: async (
    userId: string,
    page = 0,
    size = 50,
  ): Promise<ApiPage<AppointmentResponse>> => {
    const response = await api.get<ApiPage<AppointmentResponse>>(
      `/appointments/patient/${userId}`,
      { params: { page, size } },
    );
    return response.data;
  },

  getByDoctor: async (
    doctorId: string,
    page = 0,
    size = 50,
  ): Promise<ApiPage<AppointmentResponse>> => {
    const response = await api.get<ApiPage<AppointmentResponse>>(
      `/appointments/doctor/${doctorId}`,
      { params: { page, size } },
    );
    return response.data;
  },

  confirm: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.put<AppointmentResponse>(
      `/appointments/${id}/confirm`,
    );
    return response.data;
  },

  cancel: async (
    id: string,
    data: CancelAppointmentInput,
  ): Promise<AppointmentResponse> => {
    const response = await api.put<AppointmentResponse>(
      `/appointments/${id}/cancel`,
      data,
    );
    return response.data;
  },

  complete: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.put<AppointmentResponse>(
      `/appointments/${id}/complete`,
    );
    return response.data;
  },

  rate: async (id: string, data: RateAppointmentInput): Promise<AppointmentResponse> => {
    const response = await api.post<AppointmentResponse>(`/appointments/${id}/rate`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};
