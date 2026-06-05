import { z } from "zod";

export const paymentMethodSchema = z.enum([
	"MERCADOPAGO",
	"PIX",
	"CREDIT_CARD",
	"DEBIT_CARD",
	"CASH",
]);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
	MERCADOPAGO: "MercadoPago",
	PIX: "Pix",
	CREDIT_CARD: "Cartão de Crédito",
	DEBIT_CARD: "Cartão de Débito",
	CASH: "Dinheiro",
};
