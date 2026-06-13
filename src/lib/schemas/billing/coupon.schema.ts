import { z } from "zod";

export const couponValidationResultSchema = z.object({
	valid: z.boolean(),
	discountAmount: z.number(),
	finalAmount: z.number(),
	message: z.string(),
	couponCode: z.string().optional(),
});
export type CouponValidationResult = z.infer<
	typeof couponValidationResultSchema
>;

export const couponUsageResponseSchema = z.object({
	id: z.string(),
	couponId: z.string(),
	couponCode: z.string().nullable().optional(),
	userId: z.string(),
	paymentId: z.string().nullable().optional(),
	discountAmount: z.number(),
	usedAt: z.string(),
});
export type CouponUsageResponse = z.infer<typeof couponUsageResponseSchema>;
