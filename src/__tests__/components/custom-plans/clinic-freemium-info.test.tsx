import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClinicFreemiumInfo } from "@/components/custom/plans/ClinicFreemiumInfo";
import { FREE_CONSULTS_PER_PROFESSIONAL } from "@/utils/constants/free-consults-per-professional";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

describe("ClinicFreemiumInfo", () => {
	it("exibe a quantidade de profissionais grátis", () => {
		render(<ClinicFreemiumInfo />);
		expect(
			screen.getByText(`${FREE_PROFESSIONALS} profissionais grátis`),
		).toBeInTheDocument();
	});

	it("exibe a quantidade de consultas gratuitas por profissional", () => {
		render(<ClinicFreemiumInfo />);
		expect(
			screen.getByText(
				`${FREE_CONSULTS_PER_PROFESSIONAL} consultas por profissional`,
			),
		).toBeInTheDocument();
	});

	it("exibe o adicional de 20% por profissional extra", () => {
		render(<ClinicFreemiumInfo />);
		expect(screen.getByText("+20% por profissional extra")).toBeInTheDocument();
	});

	it("informa a partir de qual profissional o adicional é cobrado", () => {
		render(<ClinicFreemiumInfo />);
		expect(
			screen.getByText(
				`A partir do ${FREE_PROFESSIONALS + 1}º profissional, cada um soma 20% ao valor base.`,
			),
		).toBeInTheDocument();
	});

	it("renderiza os três cartões informativos", () => {
		const { container } = render(<ClinicFreemiumInfo />);
		expect(container.querySelectorAll(".border-dashed")).toHaveLength(3);
	});
});
