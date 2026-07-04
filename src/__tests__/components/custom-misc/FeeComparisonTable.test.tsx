import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeeComparisonTable } from "@/components/custom/fees/FeeComparisonTable";

const comparison = [
	{
		paymentMethod: "PIX",
		mpFeeAmount: 2.48,
		platformFeeAmount: 12.5,
		professionalReceives: 235.02,
		patientPays: 250,
	},
	{
		paymentMethod: "CASH",
		mpFeeAmount: 0,
		platformFeeAmount: 12.5,
		professionalReceives: 237.5,
		patientPays: 250,
	},
];

describe("FeeComparisonTable", () => {
	it("renderiza uma linha para cada método de pagamento da comparação", () => {
		render(
			<FeeComparisonTable
				comparison={comparison}
				bestPaymentMethod="PIX"
				profAbsorbs={true}
			/>,
		);
		expect(screen.getByText("PIX")).toBeInTheDocument();
		expect(screen.getByText("Dinheiro")).toBeInTheDocument();
	});

	it("exibe o cabeçalho 'Você recebe' quando o profissional absorve as taxas", () => {
		render(
			<FeeComparisonTable
				comparison={comparison}
				bestPaymentMethod="PIX"
				profAbsorbs={true}
			/>,
		);
		expect(screen.getByText("Você recebe")).toBeInTheDocument();
	});

	it("exibe o cabeçalho 'Paciente paga' quando o paciente absorve as taxas", () => {
		render(
			<FeeComparisonTable
				comparison={comparison}
				bestPaymentMethod="PIX"
				profAbsorbs={false}
			/>,
		);
		expect(screen.getByText("Paciente paga")).toBeInTheDocument();
	});

	it("marca o melhor método de pagamento com o valor recebido correspondente", () => {
		render(
			<FeeComparisonTable
				comparison={comparison}
				bestPaymentMethod="PIX"
				profAbsorbs={true}
			/>,
		);
		const bestRow = screen.getByText("PIX").closest("tr");
		expect(bestRow).toHaveTextContent("R$");
		expect(bestRow?.className).toContain("bg-green-500/5");
	});

	it("não marca nenhuma linha quando bestPaymentMethod é indefinido", () => {
		render(
			<FeeComparisonTable
				comparison={comparison}
				bestPaymentMethod={undefined}
				profAbsorbs={true}
			/>,
		);
		const pixRow = screen.getByText("PIX").closest("tr");
		expect(pixRow?.className).not.toContain("bg-green-500/5");
	});
});
