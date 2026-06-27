import type { BillingPaymentResponse } from "@/lib/schemas/billing/payment.schema";

export interface PaymentTableProps {
	payments: BillingPaymentResponse[];
}
