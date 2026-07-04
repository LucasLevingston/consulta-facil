import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WalletHistoryTable } from "@/components/wallet/WalletHistoryTable";
import type { WalletTransactionResponse } from "@/features/billing";

function buildTransaction(
	overrides: Partial<WalletTransactionResponse> = {},
): WalletTransactionResponse {
	return {
		id: "tx-1",
		walletId: "wallet-1",
		type: "DEPOSIT",
		amount: 100,
		description: "Deposito inicial",
		createdAt: "2026-03-10T12:00:00.000Z",
		...overrides,
	} as WalletTransactionResponse;
}

describe("WalletHistoryTable", () => {
	it("exibe mensagem de lista vazia quando não há transações", () => {
		render(<WalletHistoryTable transactions={[]} />);
		expect(
			screen.getByText("Nenhuma transacao encontrada."),
		).toBeInTheDocument();
		expect(screen.queryByRole("table")).not.toBeInTheDocument();
	});

	it("renderiza uma linha para cada transação da lista", () => {
		const transactions = [
			buildTransaction({ id: "t1" }),
			buildTransaction({ id: "t2" }),
		];
		render(<WalletHistoryTable transactions={transactions} />);
		expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 linhas
	});

	it("exibe o rótulo correto para cada tipo de transação", () => {
		render(
			<WalletHistoryTable
				transactions={[
					buildTransaction({ id: "t1", type: "REFERRAL_COMMISSION" }),
					buildTransaction({ id: "t2", type: "WITHDRAW" }),
					buildTransaction({ id: "t3", type: "DEPOSIT" }),
					buildTransaction({ id: "t4", type: "ADJUSTMENT" }),
				]}
			/>,
		);
		expect(screen.getByText("Comissao de Indicacao")).toBeInTheDocument();
		expect(screen.getByText("Saque")).toBeInTheDocument();
		expect(screen.getByText("Deposito")).toBeInTheDocument();
		expect(screen.getByText("Ajuste")).toBeInTheDocument();
	});

	it("formata o valor da transação em BRL", () => {
		render(
			<WalletHistoryTable transactions={[buildTransaction({ amount: 75 })]} />,
		);
		expect(screen.getByText("R$ 75,00")).toBeInTheDocument();
	});

	it("exibe a descrição da transação quando fornecida", () => {
		render(
			<WalletHistoryTable
				transactions={[buildTransaction({ description: "Saque via PIX" })]}
			/>,
		);
		expect(screen.getByText("Saque via PIX")).toBeInTheDocument();
	});

	it("exibe travessão quando não há descrição", () => {
		render(
			<WalletHistoryTable
				transactions={[buildTransaction({ description: undefined })]}
			/>,
		);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("formata a data de criação no padrão brasileiro", () => {
		render(
			<WalletHistoryTable
				transactions={[
					buildTransaction({ createdAt: "2026-07-04T10:00:00.000Z" }),
				]}
			/>,
		);
		expect(screen.getByText("04/07/2026")).toBeInTheDocument();
	});
});
