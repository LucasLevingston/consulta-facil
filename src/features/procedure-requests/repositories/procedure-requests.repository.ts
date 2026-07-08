import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";
import type { CreateProcedureRequestInput } from "@/lib/schemas/procedure-request/create-procedure-request.schema";
import type { ProcedureRequest } from "@/lib/schemas/procedure-request/procedure-request.schema";
import type { ScheduleProcedureRequestInput } from "@/lib/schemas/procedure-request/schedule-procedure-request.schema";

export const procedureRequestsRepository = {
	create: (data: CreateProcedureRequestInput): Promise<ProcedureRequest> =>
		procedureRequestsApi.create(data),

	getMine: (): Promise<ProcedureRequest[]> => procedureRequestsApi.getMine(),

	schedule: (
		requestId: string,
		data: ScheduleProcedureRequestInput,
	): Promise<ProcedureRequest> =>
		procedureRequestsApi.schedule(requestId, data),

	cancel: (requestId: string): Promise<ProcedureRequest> =>
		procedureRequestsApi.cancel(requestId),
};
