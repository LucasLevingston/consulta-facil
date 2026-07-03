import { api } from "@/config/api";
import type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
import type { AnamnesisResponse } from "@/lib/schemas/anamnesis/anamnesis-response.schema";
import type { ProntuarioInput } from "@/lib/schemas/anamnesis/prontuario.schema";
import type { ProntuarioResponse } from "@/lib/schemas/anamnesis/prontuario-response.schema";

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
