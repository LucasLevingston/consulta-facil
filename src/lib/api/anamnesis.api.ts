import { api } from "@/config/api";
import type {
	AnamnesisInput,
	AnamnesisResponse,
	ProntuarioInput,
	ProntuarioResponse,
} from "@/lib/schemas/anamnesis.schema";

export const anamnesisApi = {
	getAnamnesis: async (
		appointmentId: string,
	): Promise<AnamnesisResponse | null> => {
		const response = await api.get<AnamnesisResponse>(
			`/appointments/${appointmentId}/anamnesis`,
		);
		return response.status === 204 ? null : response.data;
	},

	saveAnamnesis: async (
		appointmentId: string,
		data: AnamnesisInput,
	): Promise<AnamnesisResponse> => {
		const response = await api.put<AnamnesisResponse>(
			`/appointments/${appointmentId}/anamnesis`,
			data,
		);
		return response.data;
	},

	getProntuario: async (
		appointmentId: string,
	): Promise<ProntuarioResponse | null> => {
		const response = await api.get<ProntuarioResponse>(
			`/appointments/${appointmentId}/prontuario`,
		);
		return response.status === 204 ? null : response.data;
	},

	saveProntuario: async (
		appointmentId: string,
		data: ProntuarioInput,
	): Promise<ProntuarioResponse> => {
		const response = await api.put<ProntuarioResponse>(
			`/appointments/${appointmentId}/prontuario`,
			data,
		);
		return response.data;
	},
};
