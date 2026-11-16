import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorksSection } from "./HowItWorksSection";

describe("HowItWorksSection", () => {
	it("explains booking in three numbered steps, in order", () => {
		render(<HowItWorksSection />);

		expect(
			screen.getByRole("heading", { name: "Agende em 3 passos simples" }),
		).toBeInTheDocument();
		expect(
			screen.getAllByText(/^Passo \d{2}$/).map((s) => s.textContent),
		).toEqual(["Passo 01", "Passo 02", "Passo 03"]);
		expect(
			screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
		).toEqual([
			"Encontre um profissional",
			"Escolha data e horário",
			"Compareça e seja atendido",
		]);
	});
});
