import type { AppointmentPaymentStatus } from "@/features/appointments";

export const PAYMENT_LABELS: Record<AppointmentPaymentStatus, string> = {
	UNPAID: "Não pago",
	PENDING_PAYMENT: "Aguardando pagamento",
	PAID: "Pago",
	REFUNDED: "Reembolsado",
	FREE: "Gratuito",
};

export const PAYMENT_VARIANTS: Record<
	AppointmentPaymentStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	UNPAID: "outline",
	PENDING_PAYMENT: "secondary",
	PAID: "default",
	REFUNDED: "destructive",
	FREE: "secondary",
};
