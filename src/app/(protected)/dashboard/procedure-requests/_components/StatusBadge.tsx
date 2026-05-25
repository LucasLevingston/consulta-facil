"use client";

import { Badge } from "@/components/ui/badge";
import type { ProcedureRequestStatus } from "@/lib/schemas/procedure-request.schema";

const STATUS_LABELS: Record<ProcedureRequestStatus, string> = {
	PENDING: "Pendente",
	SCHEDULED: "Agendado",
	COMPLETED: "Concluído",
	CANCELED: "Cancelado",
};

const STATUS_VARIANTS: Record<
	ProcedureRequestStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	PENDING: "default",
	SCHEDULED: "secondary",
	COMPLETED: "outline",
	CANCELED: "destructive",
};

export function StatusBadge({ status }: { status: ProcedureRequestStatus }) {
	return (
		<Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
	);
}
