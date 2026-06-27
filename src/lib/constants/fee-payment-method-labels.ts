import type { FeePaymentMethod } from "@/lib/types/fee-payment-method";

export const PAYMENT_METHOD_LABELS: Record<FeePaymentMethod, string> = {
	PIX: "PIX",
	CREDIT_CARD: "Cartão de crédito",
	DEBIT_CARD: "Cartão de débito",
	CASH: "Dinheiro",
	MERCADOPAGO: "MercadoPago",
};
