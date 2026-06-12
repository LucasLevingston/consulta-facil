import { z } from "zod";

export const updateSystemFeeSchema = z.object({
	fixedFee: z.number().min(0).optional(),
	percentageFee: z.number().min(0).max(1).optional(),
	active: z.boolean().optional(),
});

export type UpdateSystemFeeValues = z.infer<typeof updateSystemFeeSchema>;

export interface SystemFeeResponse {
	id: string;
	paymentType: string;
	fixedFee: number;
	percentageFee: number;
	active: boolean;
	updatedAt: string;
}
