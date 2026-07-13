import { describe, expect, it } from "vitest";
import { professionalRatingSchema } from "./professional-rating.schema";

describe("professionalRatingSchema", () => {
	const valid = {
		averageRating: 4.5,
		totalRatings: 10,
		distribution: { "5": 6, "4": 4 },
	};

	it("aceita objeto válido", () => {
		expect(professionalRatingSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita averageRating nulo", () => {
		expect(
			professionalRatingSchema.safeParse({ ...valid, averageRating: null })
				.success,
		).toBe(true);
	});

	it("rejeita sem averageRating (obrigatório, mas nullable)", () => {
		const { averageRating, ...withoutAverage } = valid;
		expect(professionalRatingSchema.safeParse(withoutAverage).success).toBe(
			false,
		);
	});

	it("rejeita tipo inválido em distribution", () => {
		expect(
			professionalRatingSchema.safeParse({ ...valid, distribution: "5" })
				.success,
		).toBe(false);
	});
});
