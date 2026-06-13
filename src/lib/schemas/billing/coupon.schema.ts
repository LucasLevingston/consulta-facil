import { z } from "zod";

export const couponResponseSchema = z.object({
	id: z.string(),
	code: z.string(),
	description: z.string().nullable().optional(),
	type: z.enum(["PERCENT", "FIXED"]),
	value: z.number(),
	maxUses: z.number().nullable().optional(),
	currentUses: z.number(),
	maxUsesPerUser: z.number(),
	startsAt: z.string().nullable().optional(),
	expiresAt: z.string().nullable().optional(),
	applicablePlanIds: z.string().nullable().optional(),
	sellerId: z.string().nullable().optional(),
	status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]),
	createdBy: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
});
export type CouponResponse = z.infer<typeof couponResponseSchema>;

export const createCouponSchema = z.object({
	code: z.string().min(2).max(50),
	description: z.string().optional(),
	type: z.enum(["PERCENT", "FIXED"]),
	value: z.number().min(0.01),
	maxUses: z.number().int().min(1).optional(),
	maxUsesPerUser: z.number().int().min(1).optional(),
	expiresAt: z.string().optional(),
});
export type CreateCouponData = z.infer<typeof createCouponSchema>;

export const updateCouponSchema = z.object({
	description: z.string().optional(),
	status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]).optional(),
	expiresAt: z.string().optional(),
	maxUses: z.number().int().min(1).optional(),
});
export type UpdateCouponData = z.infer<typeof updateCouponSchema>;

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
