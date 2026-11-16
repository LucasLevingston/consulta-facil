import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
	it("renders the headline and value proposition", () => {
		render(<HeroSection />);

		expect(
			screen.getByRole("heading", {
				level: 1,
				name: /Agende consultas médicas/,
			}),
		).toBeInTheDocument();
		expect(screen.getByText("em poucos segundos")).toBeInTheDocument();
		expect(screen.getByText("Sem filas")).toBeInTheDocument();
		expect(screen.getByText("Profissionais verificados")).toBeInTheDocument();
	});

	it("links to sign up and sign in", () => {
		render(<HeroSection />);

		expect(screen.getByRole("link", { name: "Criar conta" })).toHaveAttribute(
			"href",
			"/auth/register",
		);
		expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute(
			"href",
			"/auth/login",
		);
	});

	it("shows the three platform stats", () => {
		render(<HeroSection />);

		const stats = screen.getAllByRole("heading", { level: 3 });
		expect(stats.map((s) => s.textContent)).toEqual(["10k+", "500+", "98%"]);
		expect(screen.getByText("Consultas realizadas")).toBeInTheDocument();
	});
});
