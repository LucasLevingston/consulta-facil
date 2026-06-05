import type { AppointmentStatus } from "@/lib/schemas/appointment/appointment-status.schema";

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
	PENDING: "Pendente",
	CONFIRMED: "Confirmada",
	CHECKED_IN: "Check-in feito",
	IN_PROGRESS: "Em atendimento",
	CANCELED: "Cancelada",
	COMPLETED: "Concluída",
};
