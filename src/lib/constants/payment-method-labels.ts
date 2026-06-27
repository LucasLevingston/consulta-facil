import type { PaymentMethod } from "@/lib/schemas/doctor/payment-method.schema";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
	MERCADOPAGO: "MercadoPago",
	PIX: "Pix",
	CREDIT_CARD: "Cartão de Crédito",
	DEBIT_CARD: "Cartão de Débito",
	CASH: "Dinheiro",
};
