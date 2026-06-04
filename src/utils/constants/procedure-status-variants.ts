import type { ProcedureRequestStatus } from "@/lib/schemas/procedure-request.schema";

export const STATUS_VARIANTS: Record<
	ProcedureRequestStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	PENDING: "default",
	SCHEDULED: "secondary",
	COMPLETED: "outline",
	CANCELED: "destructive",
};
