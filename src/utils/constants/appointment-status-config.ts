import type { AppointmentStatus } from "@/lib/schemas/appointment/appointment-status.schema";

export const STATUS_CONFIG: Record<
	AppointmentStatus,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	CONFIRMED: { label: "Confirmada", variant: "default" },
	CHECKED_IN: { label: "Check-in feito", variant: "default" },
	IN_PROGRESS: { label: "Em atendimento", variant: "default" },
	COMPLETED: { label: "Concluída", variant: "outline" },
	CANCELED: { label: "Cancelada", variant: "destructive" },
};
