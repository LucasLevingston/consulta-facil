import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RatingDistributionCard } from "./RatingDistributionCard";

describe("RatingDistributionCard", () => {
	it("renderiza mensagem quando não há avaliações", () => {
		render(
			<RatingDistributionCard
				ratings={
					{ averageRating: null, totalRatings: 0, distribution: {} } as never
				}
			/>,
		);
		expect(screen.getByText("Nenhuma avaliacao ainda.")).toBeInTheDocument();
	});

	it("renderiza a média e o total de avaliações", () => {
		render(
			<RatingDistributionCard
				ratings={
					{
						averageRating: 4.2,
						totalRatings: 15,
						distribution: { "5": 8, "4": 5, "3": 2 },
					} as never
				}
			/>,
		);
		expect(screen.getByText("4.2")).toBeInTheDocument();
		expect(screen.getByText(/15 avaliacoes/)).toBeInTheDocument();
	});
});
