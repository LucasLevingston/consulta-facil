import { z } from "zod";

export const professionalProfileStatusSchema = z.enum([
	"PENDING_REVIEW",
	"ACTIVE",
	"REJECTED",
]);
export type ProfessionalProfileStatus = z.infer<
	typeof professionalProfileStatusSchema
>;

export const paymentMethodSchema = z.enum([
	"MERCADOPAGO",
	"PIX",
	"CREDIT_CARD",
	"DEBIT_CARD",
	"CASH",
]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentTimingSchema = z.enum(["AT_SCHEDULING", "AT_CONSULTATION"]);
export type PaymentTiming = z.infer<typeof paymentTimingSchema>;

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
	MERCADOPAGO: "MercadoPago",
	PIX: "Pix",
	CREDIT_CARD: "Cartão de Crédito",
	DEBIT_CARD: "Cartão de Débito",
	CASH: "Dinheiro",
};

export const updatePaymentSettingsSchema = z.object({
	paymentTiming: paymentTimingSchema,
	acceptedPaymentMethods: z
		.array(paymentMethodSchema)
		.min(1, "Selecione ao menos um método de pagamento"),
});
export type UpdatePaymentSettingsInput = z.infer<
	typeof updatePaymentSettingsSchema
>;

export const professionalResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	profession: z.string().nullable().optional(),
	specialty: z.string(),
	licenseNumber: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	rating: z.number().nullable().optional(),
	consultationCount: z.number().nullable().optional(),
	status: professionalProfileStatusSchema.nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	clinicId: z.string().nullable().optional(),
	clinicName: z.string().nullable().optional(),
	consultationPrice: z.number().nullable().optional(),
	acceptedPaymentMethods: z.array(paymentMethodSchema).optional().default([]),
	paymentTiming: paymentTimingSchema.nullable().optional(),
});

export const createProfessionalSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	profession: z.string().min(2, "Profissão é obrigatória"),
	specialty: z
		.string()
		.min(3, "Especialidade deve ter pelo menos 3 caracteres")
		.max(100),
	licenseNumber: z
		.string()
		.min(5, "Número de registro deve ter pelo menos 5 caracteres")
		.max(50),
});

export type ProfessionalResponse = z.infer<typeof professionalResponseSchema>;
export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type ApiPage<T> = {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first?: boolean;
	last?: boolean;
};

// Backwards-compatible aliases
export const doctorProfileStatusSchema = professionalProfileStatusSchema;
export type DoctorProfileStatus = ProfessionalProfileStatus;
export const doctorResponseSchema = professionalResponseSchema;
export const createDoctorSchema = createProfessionalSchema;
export type DoctorResponse = ProfessionalResponse;
export type CreateDoctorInput = CreateProfessionalInput;
