"use client";

import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/utils/constants/procedure-status-labels";
import { STATUS_VARIANTS } from "@/utils/constants/procedure-status-variants";
import type { StatusBadgeProps } from "./StatusBadge.types";

export function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
	);
}
