import { api } from "@/config/api";
import type {
	CreateProcedureRequestInput,
	ProcedureRequest,
	ScheduleProcedureRequestInput,
} from "@/lib/schemas/procedure-request.schema";

export const procedureRequestsApi = {
	create: async (
		data: CreateProcedureRequestInput,
	): Promise<ProcedureRequest> => {
		const response = await api.post<ProcedureRequest>(
			"/procedure-requests",
			data,
		);
		return response.data;
	},

	getMine: async (): Promise<ProcedureRequest[]> => {
		const response = await api.get<ProcedureRequest[]>(
			"/procedure-requests/mine",
		);
		return response.data;
	},

	schedule: async (
		requestId: string,
		data: ScheduleProcedureRequestInput,
	): Promise<ProcedureRequest> => {
		const response = await api.post<ProcedureRequest>(
			`/procedure-requests/${requestId}/schedule`,
			data,
		);
		return response.data;
	},

	cancel: async (requestId: string): Promise<ProcedureRequest> => {
		const response = await api.put<ProcedureRequest>(
			`/procedure-requests/${requestId}/cancel`,
		);
		return response.data;
	},
};
