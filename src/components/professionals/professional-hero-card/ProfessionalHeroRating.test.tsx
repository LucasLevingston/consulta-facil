import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfessionalHeroRating } from "./ProfessionalHeroRating";

describe("ProfessionalHeroRating", () => {
	it("shows the rating with one decimal and fills the rounded number of stars", () => {
		const { container } = render(
			<ProfessionalHeroRating rating={4.6} consultationCount={12} />,
		);

		expect(screen.getByText("4.6")).toBeInTheDocument();
		expect(container.querySelectorAll("svg.fill-amber-400")).toHaveLength(5);
	});

	it("rounds down below the half star", () => {
		const { container } = render(
			<ProfessionalHeroRating rating={3.4} consultationCount={null} />,
		);

		expect(container.querySelectorAll("svg.fill-amber-400")).toHaveLength(3);
	});

	it.each([
		[1, "· 1 consulta"],
		[12, "· 12 consultas"],
	])("pluralizes %i consultation(s)", (count, text) => {
		render(<ProfessionalHeroRating rating={5} consultationCount={count} />);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it.each([
		0,
		null,
		undefined,
	])("hides the consultation count when it is %s", (count) => {
		render(<ProfessionalHeroRating rating={5} consultationCount={count} />);

		expect(screen.queryByText(/consulta/)).not.toBeInTheDocument();
	});
});
