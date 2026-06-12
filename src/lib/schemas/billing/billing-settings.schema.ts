import { z } from "zod";

export const updateBillingSettingsSchema = z.object({
	defaultCurrency: z.string().length(3).optional(),
	defaultGateway: z.string().optional(),
	webhookSecret: z.string().optional(),
	pixExpirationMinutes: z.number().int().positive().optional(),
	invoiceExpirationDays: z.number().int().positive().optional(),
	defaultTrialDays: z.number().int().min(0).optional(),
});

export type UpdateBillingSettingsValues = z.infer<
	typeof updateBillingSettingsSchema
>;

export interface BillingSettingsResponse {
	id: string;
	defaultCurrency: string;
	defaultGateway: string;
	webhookSecret: string | null;
	pixExpirationMinutes: number;
	invoiceExpirationDays: number;
	defaultTrialDays: number;
	updatedAt: string;
}
