import type { BillingPaymentStatus } from "@/lib/schemas/billing/payment.schema";

export interface PaymentStatusBadgeProps {
	status: BillingPaymentStatus;
}
