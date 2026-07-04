import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaymentTable } from "@/components/billing/PaymentTable";
import type { BillingPaymentResponse } from "@/features/billing";

function buildPayment(
	overrides: Partial<BillingPaymentResponse> = {},
): BillingPaymentResponse {
	return {
		id: "payment-1",
		paymentType: "CONSULTATION",
		amount: 200,
		systemFee: 20,
		netAmount: 180,
		status: "PAID",
		createdAt: "2026-01-05T00:00:00.000Z",
		...overrides,
	} as BillingPaymentResponse;
}

describe("PaymentTable", () => {
	it("exibe mensagem de lista vazia quando nao ha pagamentos", () => {
		render(<PaymentTable payments={[]} />);
		expect(
			screen.getByText("Nenhum pagamento encontrado."),
		).toBeInTheDocument();
	});

	it("renderiza uma linha para cada pagamento da lista", () => {
		const payments = [buildPayment({ id: "p1" }), buildPayment({ id: "p2" })];
		render(<PaymentTable payments={payments} />);
		expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 linhas
	});

	it("formata valor, taxa e valor liquido em BRL", () => {
		render(
			<PaymentTable
				payments={[
					buildPayment({ amount: 200, systemFee: 20, netAmount: 180 }),
				]}
			/>,
		);
		expect(screen.getByText("R$ 200,00")).toBeInTheDocument();
		expect(screen.getByText("R$ 20,00")).toBeInTheDocument();
		expect(screen.getByText("R$ 180,00")).toBeInTheDocument();
	});

	it("traduz o tipo de pagamento conhecido", () => {
		render(
			<PaymentTable payments={[buildPayment({ paymentType: "PROCEDURE" })]} />,
		);
		expect(screen.getByText("Procedimento")).toBeInTheDocument();
	});

	it("exibe o tipo de pagamento original quando desconhecido", () => {
		render(
			<PaymentTable payments={[buildPayment({ paymentType: "OUTRO" })]} />,
		);
		expect(screen.getByText("OUTRO")).toBeInTheDocument();
	});

	it("exibe o status do pagamento atraves do badge", () => {
		render(<PaymentTable payments={[buildPayment({ status: "FAILED" })]} />);
		expect(screen.getByText("Falhou")).toBeInTheDocument();
	});

	it("formata a data de criacao no padrao pt-BR", () => {
		render(
			<PaymentTable
				payments={[buildPayment({ createdAt: "2026-06-15T00:00:00.000Z" })]}
			/>,
		);
		expect(
			screen.getByText(
				new Date("2026-06-15T00:00:00.000Z").toLocaleDateString("pt-BR"),
			),
		).toBeInTheDocument();
	});
});
