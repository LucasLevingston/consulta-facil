import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BenefitsSection } from "./BenefitsSection";

describe("BenefitsSection", () => {
	it("renders the section heading", () => {
		render(<BenefitsSection />);

		expect(
			screen.getByRole("heading", {
				level: 2,
				name: "Tudo que você precisa para cuidar da sua saúde",
			}),
		).toBeInTheDocument();
	});

	it("lists the three benefits with their descriptions", () => {
		render(<BenefitsSection />);

		const titles = screen
			.getAllByRole("heading", { level: 3 })
			.map((h) => h.textContent);
		expect(titles).toEqual([
			"Especialistas verificados",
			"Agendamento 24/7",
			"Segurança garantida",
		]);
		expect(
			screen.getByText("Seus dados protegidos com total privacidade."),
		).toBeInTheDocument();
	});
});
