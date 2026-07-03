import { api } from "@/config/api";
import type { CreateProcedureRequestInput } from "@/lib/schemas/procedure-request/create-procedure-request.schema";
import type { ProcedureRequest } from "@/lib/schemas/procedure-request/procedure-request.schema";
import type { ScheduleProcedureRequestInput } from "@/lib/schemas/procedure-request/schedule-procedure-request.schema";

export const procedureRequestsRepository = {
	create: async (
		data: CreateProcedureRequestInput,
	): Promise<ProcedureRequest> => {
		const res = await api.post<ProcedureRequest>("/procedure-requests", data);
		return res.data;
	},

	getMine: async (): Promise<ProcedureRequest[]> => {
		const res = await api.get<ProcedureRequest[]>("/procedure-requests/mine");
		return res.data;
	},

	schedule: async (
		requestId: string,
		data: ScheduleProcedureRequestInput,
	): Promise<ProcedureRequest> => {
		const res = await api.post<ProcedureRequest>(
			`/procedure-requests/${requestId}/schedule`,
			data,
		);
		return res.data;
	},

	cancel: async (requestId: string): Promise<ProcedureRequest> => {
		const res = await api.put<ProcedureRequest>(
			`/procedure-requests/${requestId}/cancel`,
		);
		return res.data;
	},
};
