import { z } from "zod";

export const paymentMethodSchema = z.enum([
	"MERCADOPAGO",
	"PIX",
	"CREDIT_CARD",
	"DEBIT_CARD",
	"CASH",
]);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
