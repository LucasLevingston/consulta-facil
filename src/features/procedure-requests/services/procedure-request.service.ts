import type { ProcedureRequest } from "@/lib/schemas/procedure-request/procedure-request.schema";
import type { ProcedureRequestStatus } from "@/lib/schemas/procedure-request/procedure-request-status.schema";

const STATUS_LABELS: Record<ProcedureRequestStatus, string> = {
	PENDING: "Pendente",
	SCHEDULED: "Agendado",
	COMPLETED: "Concluído",
	CANCELED: "Cancelado",
};

export const procedureRequestService = {
	canCancel: (req: ProcedureRequest): boolean =>
		req.status === "PENDING" || req.status === "SCHEDULED",

	canSchedule: (req: ProcedureRequest): boolean => req.status === "PENDING",

	getStatusLabel: (status: ProcedureRequestStatus): string =>
		STATUS_LABELS[status] ?? status,
};
