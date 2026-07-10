import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfessionalContactCard } from "./ProfessionalContactCard";
import { ProfessionalDetailCards } from "./ProfessionalDetailCards";

describe("ProfessionalContactCard", () => {
	it("renderiza e-mail, telefone e registro quando fornecidos", () => {
		render(
			<ProfessionalContactCard
				professional={
					{
						email: "medico@email.com",
						phone: "(11) 99999-0000",
						licenseNumber: "CRM-1234",
						bio: null,
					} as never
				}
			/>,
		);
		expect(screen.getByText("medico@email.com")).toBeInTheDocument();
		expect(screen.getByText("(11) 99999-0000")).toBeInTheDocument();
		expect(screen.getByText("CRM-1234")).toBeInTheDocument();
	});

	it("renderiza o card 'Sobre' quando há bio", () => {
		render(
			<ProfessionalContactCard
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: "Atuo há 10 anos.",
					} as never
				}
			/>,
		);
		expect(screen.getByText("Sobre")).toBeInTheDocument();
		expect(screen.getByText("Atuo há 10 anos.")).toBeInTheDocument();
	});

	it("não renderiza o card 'Sobre' quando não há bio", () => {
		render(
			<ProfessionalContactCard
				professional={
					{ email: null, phone: null, licenseNumber: null, bio: null } as never
				}
			/>,
		);
		expect(screen.queryByText("Sobre")).not.toBeInTheDocument();
	});
});

describe("ProfessionalDetailCards", () => {
	it("renderiza a especialidade quando fornecida", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: "Cardiologia",
						instagramUrl: null,
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("renderiza mensagem quando não há especialidade", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: null,
						instagramUrl: null,
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(
			screen.getByText("Especialidade não informada."),
		).toBeInTheDocument();
	});

	it("renderiza redes sociais quando há links", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: null,
						instagramUrl: "https://instagram.com/x",
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(screen.getByText("Redes sociais")).toBeInTheDocument();
		expect(screen.getByText("Instagram")).toBeInTheDocument();
	});

	it("não renderiza o card de redes sociais quando não há links", () => {
		render(
			<ProfessionalDetailCards
				professional={
					{
						email: null,
						phone: null,
						licenseNumber: null,
						bio: null,
						specialty: null,
						instagramUrl: null,
						linkedinUrl: null,
						websiteUrl: null,
					} as never
				}
			/>,
		);
		expect(screen.queryByText("Redes sociais")).not.toBeInTheDocument();
	});
});
