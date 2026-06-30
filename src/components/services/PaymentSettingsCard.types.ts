import type { PaymentMethod, PaymentTiming } from "@/features/professionals";

export interface PaymentSettingsCardProps {
	acceptedPaymentMethods: PaymentMethod[];
	paymentTiming: PaymentTiming | null | undefined;
}
