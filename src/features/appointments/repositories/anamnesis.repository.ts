import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";
import type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
import type { AnamnesisResponse } from "@/lib/schemas/anamnesis/anamnesis-response.schema";
import type { ProntuarioInput } from "@/lib/schemas/anamnesis/prontuario.schema";
import type { ProntuarioResponse } from "@/lib/schemas/anamnesis/prontuario-response.schema";

export const anamnesisRepository = {
	getAnamnesis: (appointmentId: string): Promise<AnamnesisResponse | null> =>
		anamnesisApi.getAnamnesis(appointmentId),

	saveAnamnesis: (
		appointmentId: string,
		data: AnamnesisInput,
	): Promise<AnamnesisResponse> =>
		anamnesisApi.saveAnamnesis(appointmentId, data),

	getProntuario: (appointmentId: string): Promise<ProntuarioResponse | null> =>
		anamnesisApi.getProntuario(appointmentId),

	saveProntuario: (
		appointmentId: string,
		data: ProntuarioInput,
	): Promise<ProntuarioResponse> =>
		anamnesisApi.saveProntuario(appointmentId, data),
};
