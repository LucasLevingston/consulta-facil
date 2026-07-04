import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClinicPriceDisplay } from "@/components/custom/plans/ClinicPriceDisplay";
import { FREE_CONSULTS_PER_PROFESSIONAL } from "@/utils/constants/free-consults-per-professional";

describe("ClinicPriceDisplay", () => {
	it("exibe 'Grátis' quando isFree é true", () => {
		render(
			<ClinicPriceDisplay
				isFree={true}
				calcPrice={0}
				extraProfessionals={0}
				calcProfessionals={3}
			/>,
		);
		expect(screen.getByText("Grátis")).toBeInTheDocument();
	});

	it("exibe a quantidade de consultas gratuitas incluídas quando isFree é true", () => {
		render(
			<ClinicPriceDisplay
				isFree={true}
				calcPrice={0}
				extraProfessionals={0}
				calcProfessionals={3}
			/>,
		);
		expect(
			screen.getByText(
				`${3 * FREE_CONSULTS_PER_PROFESSIONAL} consultas gratuitas incluídas`,
			),
		).toBeInTheDocument();
	});

	it("exibe o badge de plano grátis quando isFree é true", () => {
		render(
			<ClinicPriceDisplay
				isFree={true}
				calcPrice={0}
				extraProfessionals={0}
				calcProfessionals={3}
			/>,
		);
		expect(screen.getByText("Plano grátis")).toBeInTheDocument();
	});

	it("exibe o preço mensal formatado quando isFree é false", () => {
		render(
			<ClinicPriceDisplay
				isFree={false}
				calcPrice={840}
				extraProfessionals={1}
				calcProfessionals={6}
			/>,
		);
		expect(screen.getByText("R$ 840,00")).toBeInTheDocument();
	});

	it("exibe a composição base + extra quando isFree é false", () => {
		render(
			<ClinicPriceDisplay
				isFree={false}
				calcPrice={840}
				extraProfessionals={1}
				calcProfessionals={6}
			/>,
		);
		expect(
			screen.getByText("Base R$ 700,00 + 1 profissional extra (20% adicional)"),
		).toBeInTheDocument();
	});

	it("exibe o badge com a quantidade de profissionais além do limite quando isFree é false", () => {
		render(
			<ClinicPriceDisplay
				isFree={false}
				calcPrice={840}
				extraProfessionals={2}
				calcProfessionals={7}
			/>,
		);
		expect(screen.getByText("2 além do limite")).toBeInTheDocument();
	});
});
