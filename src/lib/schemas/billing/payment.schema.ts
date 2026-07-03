import { z } from "zod";

export type BillingPaymentStatus =
	| "PENDING"
	| "PAID"
	| "FAILED"
	| "REFUNDED"
	| "CANCELED";
export type PaymentType =
	| "CONSULTATION"
	| "PROCEDURE"
	| "EXAM"
	| "SUBSCRIPTION";
export type OwnerType = "PROFESSIONAL" | "CLINIC" | "LABORATORY";

export const createBillingPaymentSchema = z.object({
	paymentType: z.enum(["CONSULTATION", "PROCEDURE", "EXAM", "SUBSCRIPTION"]),
	referenceId: z.string().optional(),
	ownerType: z.enum(["PROFESSIONAL", "CLINIC", "LABORATORY"]).optional(),
	ownerId: z.string().optional(),
	amount: z.number().positive("amount deve ser maior que zero"),
	paymentMethod: z.string().optional(),
	gateway: z.string().optional(),
	payerId: z.string().min(1, "payerId é obrigatório"),
	payerName: z.string().optional(),
	payerEmail: z.string().email().optional(),
	description: z.string().optional(),
});

export type CreateBillingPaymentValues = z.infer<
	typeof createBillingPaymentSchema
>;

export interface BillingPaymentResponse {
	id: string;
	paymentType: PaymentType;
	referenceId: string | null;
	ownerType: OwnerType | null;
	ownerId: string | null;
	amount: number;
	systemFee: number;
	gatewayFee: number;
	netAmount: number;
	currency: string;
	paymentMethod: string | null;
	gateway: string;
	gatewayPaymentId: string | null;
	status: BillingPaymentStatus;
	payerId: string;
	payerName: string | null;
	payerEmail: string | null;
	description: string | null;
	paidAt: string | null;
	createdAt: string;
}
