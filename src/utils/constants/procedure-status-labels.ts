import type { ProcedureRequestStatus } from "@/lib/schemas/procedure-request.schema";

export const STATUS_LABELS: Record<ProcedureRequestStatus, string> = {
	PENDING: "Pendente",
	SCHEDULED: "Agendado",
	COMPLETED: "Concluído",
	CANCELED: "Cancelado",
};
