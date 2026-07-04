import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CommissionTable } from "@/components/billing/CommissionTable";
import type { ReferralCommissionResponse } from "@/features/billing";

function buildCommission(
	overrides: Partial<ReferralCommissionResponse> = {},
): ReferralCommissionResponse {
	return {
		id: "commission-1",
		amount: 150.5,
		percentage: 10,
		availableAt: "2026-01-15T00:00:00.000Z",
		status: "AVAILABLE",
		...overrides,
	} as ReferralCommissionResponse;
}

describe("CommissionTable", () => {
	it("exibe mensagem de lista vazia quando nao ha comissoes", () => {
		render(<CommissionTable commissions={[]} />);
		expect(
			screen.getByText("Nenhuma comissao encontrada."),
		).toBeInTheDocument();
	});

	it("renderiza uma linha para cada comissao da lista", () => {
		const commissions = [
			buildCommission({ id: "c1" }),
			buildCommission({ id: "c2", status: "PAID" }),
		];
		render(<CommissionTable commissions={commissions} />);
		expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 linhas
	});

	it("formata o valor da comissao em BRL", () => {
		render(
			<CommissionTable commissions={[buildCommission({ amount: 150.5 })]} />,
		);
		expect(screen.getByText("R$ 150,50")).toBeInTheDocument();
	});

	it("formata a data de disponibilidade no padrao pt-BR", () => {
		render(
			<CommissionTable
				commissions={[
					buildCommission({ availableAt: "2026-03-20T00:00:00.000Z" }),
				]}
			/>,
		);
		expect(
			screen.getByText(
				new Date("2026-03-20T00:00:00.000Z").toLocaleDateString("pt-BR"),
			),
		).toBeInTheDocument();
	});

	it("exibe o rotulo Pendente para status PENDING", () => {
		render(
			<CommissionTable
				commissions={[buildCommission({ status: "PENDING" })]}
			/>,
		);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("exibe o rotulo Cancelado para status CANCELED", () => {
		render(
			<CommissionTable
				commissions={[buildCommission({ status: "CANCELED" })]}
			/>,
		);
		expect(screen.getByText("Cancelado")).toBeInTheDocument();
	});

	it("exibe a porcentagem da comissao", () => {
		render(
			<CommissionTable commissions={[buildCommission({ percentage: 15 })]} />,
		);
		expect(screen.getByText("15%")).toBeInTheDocument();
	});
});
