import { Badge } from "@/components/ui/badge";
import type { BillingPaymentStatus } from "@/lib/schemas/billing/payment.schema";

const STATUS_CONFIG: Record<
	BillingPaymentStatus,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	PAID: { label: "Pago", variant: "default" },
	FAILED: { label: "Falhou", variant: "destructive" },
	REFUNDED: { label: "Reembolsado", variant: "outline" },
	CANCELED: { label: "Cancelado", variant: "outline" },
};

interface PaymentStatusBadgeProps {
	status: BillingPaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
	const config = STATUS_CONFIG[status] ?? {
		label: status,
		variant: "secondary" as const,
	};
	return <Badge variant={config.variant}>{config.label}</Badge>;
}
