import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ClinicPriceCalculator } from "@/components/custom/plans/ClinicPriceCalculator";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

function getButtons() {
	const buttons = screen.getAllByRole("button");
	return { minus: buttons[0], plus: buttons[1] };
}

describe("ClinicPriceCalculator", () => {
	it("inicia com a quantidade de profissionais informada", () => {
		render(<ClinicPriceCalculator initialProfessionals={3} />);
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("garante o mínimo de 1 profissional mesmo se initialProfessionals for menor", () => {
		render(<ClinicPriceCalculator initialProfessionals={0} />);
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("exibe 'Grátis' quando a quantidade está dentro do limite gratuito", () => {
		render(<ClinicPriceCalculator initialProfessionals={FREE_PROFESSIONALS} />);
		expect(screen.getByText("Grátis")).toBeInTheDocument();
	});

	it("não exibe a composição do preço quando é grátis", () => {
		render(<ClinicPriceCalculator initialProfessionals={FREE_PROFESSIONALS} />);
		expect(screen.queryByText("Composição do preço:")).not.toBeInTheDocument();
	});

	it("incrementa a quantidade de profissionais ao clicar em '+'", async () => {
		render(<ClinicPriceCalculator initialProfessionals={1} />);
		const { plus } = getButtons();
		await userEvent.click(plus);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("decrementa a quantidade de profissionais ao clicar em '-'", async () => {
		render(<ClinicPriceCalculator initialProfessionals={3} />);
		const { minus } = getButtons();
		await userEvent.click(minus);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("não decrementa abaixo de 1", async () => {
		render(<ClinicPriceCalculator initialProfessionals={1} />);
		const { minus } = getButtons();
		await userEvent.click(minus);
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("exibe o preço e a composição ao ultrapassar o limite gratuito", async () => {
		render(<ClinicPriceCalculator initialProfessionals={FREE_PROFESSIONALS} />);
		const { plus } = getButtons();
		await userEvent.click(plus);
		expect(screen.getByText("R$ 840,00")).toBeInTheDocument();
		expect(screen.getByText("Composição do preço:")).toBeInTheDocument();
	});

	it("não incrementa acima de 50", async () => {
		render(<ClinicPriceCalculator initialProfessionals={50} />);
		const { plus } = getButtons();
		await userEvent.click(plus);
		expect(screen.getByText("50")).toBeInTheDocument();
	});
});
