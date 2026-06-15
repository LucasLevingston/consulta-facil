import { z } from "zod";

export const paymentMethodBreakdownSchema = z.object({
	paymentMethod: z.string(),
	mpFeeRate: z.number(),
	mpFeeAmount: z.number(),
	platformFeeAmount: z.number(),
	totalFees: z.number(),
	professionalReceives: z.number(),
	patientPays: z.number(),
});

export const feeCalculationResponseSchema = z.object({
	amount: z.number(),
	paymentMethod: z.string(),
	mpFeeRate: z.number(),
	mpFeeAmount: z.number(),
	platformFeeRate: z.number(),
	platformFeeAmount: z.number(),
	totalFees: z.number(),
	professionalReceives: z.number(),
	patientPays: z.number(),
	comparison: z.array(paymentMethodBreakdownSchema),
});

export const feeConfigSchema = z.object({
	pixFeeRate: z.number(),
	creditCardFeeRate: z.number(),
	debitFeeRate: z.number(),
	platformFeeRate: z.number(),
	planSlug: z.string(),
	planName: z.string(),
});

export type PaymentMethodBreakdown = z.infer<
	typeof paymentMethodBreakdownSchema
>;
export type FeeCalculationResponse = z.infer<
	typeof feeCalculationResponseSchema
>;
export type FeeConfig = z.infer<typeof feeConfigSchema>;
