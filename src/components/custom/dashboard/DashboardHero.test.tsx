import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./ProfessionalHeroSubtitle", () => ({
	ProfessionalHeroSubtitle: () => <p>subtítulo do profissional</p>,
}));

import { DashboardHero } from "./DashboardHero";

const base = {
	firstName: "Ana",
	heroLabel: "Bom dia",
	isProfessional: false,
	isPatient: false,
	isAdmin: false,
};

describe("DashboardHero", () => {
	it("greets the user by first name under the hero label", () => {
		render(<DashboardHero {...base} />);

		expect(screen.getByText("Bom dia")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 1, name: "Olá, Ana!" }),
		).toBeInTheDocument();
	});

	it("shows the professional subtitle only to professionals", () => {
		render(<DashboardHero {...base} isProfessional />);

		expect(screen.getByText("subtítulo do profissional")).toBeInTheDocument();
		expect(
			screen.queryByText("O que você quer fazer hoje?"),
		).not.toBeInTheDocument();
	});

	it("asks patients what they want to do", () => {
		render(<DashboardHero {...base} isPatient />);

		expect(screen.getByText("O que você quer fazer hoje?")).toBeInTheDocument();
	});

	it("tells admins they have full access", () => {
		render(<DashboardHero {...base} isAdmin />);

		expect(
			screen.getByText("Acesso completo à plataforma."),
		).toBeInTheDocument();
		expect(
			screen.queryByText("subtítulo do profissional"),
		).not.toBeInTheDocument();
	});
});
