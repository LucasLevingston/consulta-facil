import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing", () => ({
	FEE_PAYMENT_METHOD_LABELS: {
		PIX: "PIX",
		CREDIT_CARD: "Cartão de crédito",
		DEBIT_CARD: "Cartão de débito",
		CASH: "Dinheiro",
		MERCADOPAGO: "MercadoPago",
	},
}));

vi.mock("@/components/custom/fees/use-fee-config", () => ({
	useFeeConfig: vi.fn(),
}));

import { FeeCalculator } from "@/components/custom/fees/FeeCalculator";
import { useFeeConfig } from "@/components/custom/fees/use-fee-config";

const mockUseFeeConfig = vi.mocked(useFeeConfig);

const config = {
	pixFeeRate: 0.0099,
	creditCardFeeRate: 0.0499,
	debitFeeRate: 0.0199,
	platformFeeRate: 0.05,
	planSlug: "pro",
	planName: "Profissional",
};

describe("FeeCalculator", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("não renderiza nada quando a configuração de taxas ainda não carregou", () => {
		mockUseFeeConfig.mockReturnValue({ data: undefined } as never);
		const { container } = render(<FeeCalculator />);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza o título da calculadora e o nome do plano quando a config carrega", () => {
		mockUseFeeConfig.mockReturnValue({ data: config } as never);
		render(<FeeCalculator />);
		expect(screen.getByText("Calculadora de Taxas")).toBeInTheDocument();
		expect(screen.getByText("Profissional")).toBeInTheDocument();
		expect(screen.getByText("5.00%")).toBeInTheDocument();
	});

	it("calcula e exibe a tabela de comparação para o valor padrão informado", () => {
		mockUseFeeConfig.mockReturnValue({ data: config } as never);
		render(<FeeCalculator />);
		// Valor padrão é 250, com profAbsorbs=true o cálculo deve gerar linhas na tabela
		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByText("PIX")).toBeInTheDocument();
		expect(screen.getByText("Dinheiro")).toBeInTheDocument();
	});

	it("altera o texto do rótulo ao alternar quem absorve as taxas", async () => {
		mockUseFeeConfig.mockReturnValue({ data: config } as never);
		render(<FeeCalculator />);
		expect(screen.getByText("Profissional absorve taxas")).toBeInTheDocument();

		const { default: userEvent } = await import("@testing-library/user-event");
		await userEvent.click(screen.getByRole("switch"));

		expect(screen.getByText("Paciente paga a mais")).toBeInTheDocument();
	});

	it("atualiza o cálculo ao alterar o valor da consulta", async () => {
		mockUseFeeConfig.mockReturnValue({ data: config } as never);
		render(<FeeCalculator />);
		const { default: userEvent } = await import("@testing-library/user-event");

		const input = screen.getByLabelText("Valor da consulta (R$)");
		await userEvent.clear(input);
		await userEvent.type(input, "0");

		// Quando o valor é 0, o resultado é nulo e a tabela de comparação some
		expect(screen.queryByRole("table")).not.toBeInTheDocument();
	});
});
