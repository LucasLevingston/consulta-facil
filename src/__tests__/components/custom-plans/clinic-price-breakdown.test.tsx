import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClinicPriceBreakdown } from "@/components/custom/plans/ClinicPriceBreakdown";
import { BASE_PRICE } from "@/utils/constants/base-price";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

describe("ClinicPriceBreakdown", () => {
	it("exibe o preço base referente aos profissionais gratuitos", () => {
		render(
			<ClinicPriceBreakdown extraProfessionals={0} calcPrice={BASE_PRICE} />,
		);
		expect(
			screen.getByText(
				`Base (${FREE_PROFESSIONALS} profissionais): R$ ${BASE_PRICE.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			),
		).toBeInTheDocument();
	});

	it("não lista nenhum profissional extra quando extraProfessionals é 0", () => {
		render(
			<ClinicPriceBreakdown extraProfessionals={0} calcPrice={BASE_PRICE} />,
		);
		expect(
			screen.queryByText(/profissional \(\+20%\)/),
		).not.toBeInTheDocument();
	});

	it("lista uma linha por profissional extra com o valor de +20%", () => {
		render(
			<ClinicPriceBreakdown
				extraProfessionals={2}
				calcPrice={BASE_PRICE * 1.4}
			/>,
		);
		expect(
			screen.getByText(
				`${FREE_PROFESSIONALS + 1}º profissional (+20%): R$ 140,00`,
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				`${FREE_PROFESSIONALS + 2}º profissional (+20%): R$ 140,00`,
			),
		).toBeInTheDocument();
	});

	it("exibe o total mensal calculado", () => {
		render(<ClinicPriceBreakdown extraProfessionals={1} calcPrice={840} />);
		expect(screen.getByText("Total: R$ 840,00/mês")).toBeInTheDocument();
	});
});
