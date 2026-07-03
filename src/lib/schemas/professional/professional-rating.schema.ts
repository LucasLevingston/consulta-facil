import { z } from "zod";

export const professionalRatingSchema = z.object({
	averageRating: z.number().nullable(),
	totalRatings: z.number(),
	distribution: z.record(z.string(), z.number()),
});

export type ProfessionalRating = z.infer<typeof professionalRatingSchema>;
