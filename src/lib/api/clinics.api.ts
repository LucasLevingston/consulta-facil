import { api } from "@/config/api";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";
import type {
	ClinicResponse,
	CreateClinicInput,
	InviteReceptionistInput,
	ReceptionistResponse,
} from "@/lib/schemas/clinic.schema";

export const clinicsApi = {
	getAll: async (): Promise<ClinicResponse[]> => {
		const response = await api.get<ClinicResponse[]>("/clinics");
		return response.data;
	},

	getById: async (id: string): Promise<ClinicResponse> => {
		const response = await api.get<ClinicResponse>(`/clinics/${id}`);
		return response.data;
	},

	getMy: async (): Promise<ClinicResponse[]> => {
		const response = await api.get<ClinicResponse[]>("/clinics/my");
		return response.data;
	},

	getNearby: async (
		lat: number,
		lng: number,
		radiusKm = 50,
	): Promise<ClinicResponse[]> => {
		const response = await api.get<ClinicResponse[]>("/clinics/nearby", {
			params: { lat, lng, radiusKm },
		});
		return response.data;
	},

	create: async (data: CreateClinicInput): Promise<ClinicResponse> => {
		const response = await api.post<ClinicResponse>("/clinics", data);
		return response.data;
	},

	update: async (
		id: string,
		data: CreateClinicInput,
	): Promise<ClinicResponse> => {
		const response = await api.put<ClinicResponse>(`/clinics/${id}`, data);
		return response.data;
	},

	addMember: async (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> => {
		await api.post(`/clinics/${clinicId}/members/${professionalProfileId}`);
	},

	removeMember: async (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> => {
		await api.delete(`/clinics/${clinicId}/members/${professionalProfileId}`);
	},

	getReceptionists: async (
		clinicId: string,
	): Promise<ReceptionistResponse[]> => {
		const response = await api.get<ReceptionistResponse[]>(
			`/clinics/${clinicId}/receptionists`,
		);
		return response.data;
	},

	inviteReceptionist: async (
		clinicId: string,
		data: InviteReceptionistInput,
	): Promise<ReceptionistResponse> => {
		const response = await api.post<ReceptionistResponse>(
			`/clinics/${clinicId}/receptionists`,
			data,
		);
		return response.data;
	},

	removeReceptionist: async (
		clinicId: string,
		receptionistId: string,
	): Promise<void> => {
		await api.delete(`/clinics/${clinicId}/receptionists/${receptionistId}`);
	},

	getQueue: async (clinicId: string): Promise<AppointmentResponse[]> => {
		const response = await api.get<AppointmentResponse[]>(
			`/clinics/${clinicId}/queue`,
		);
		return response.data;
	},
};
