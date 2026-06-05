"use client";

import { Badge } from "@/components/ui/badge";
import type { ProcedureRequestStatus } from "@/lib/schemas/procedure-request/procedure-request-status.schema";
import { STATUS_LABELS } from "@/utils/constants/procedure-status-labels";
import { STATUS_VARIANTS } from "@/utils/constants/procedure-status-variants";

export function StatusBadge({ status }: { status: ProcedureRequestStatus }) {
	return (
		<Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
	);
}
