import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WalletCard } from "@/components/wallet/WalletCard";
import type { WalletResponse } from "@/features/billing";

function buildWallet(overrides: Partial<WalletResponse> = {}): WalletResponse {
	return {
		id: "wallet-1",
		userId: "user-1",
		balance: 150,
		pendingBalance: 30,
		...overrides,
	} as WalletResponse;
}

describe("WalletCard", () => {
	it("renderiza o título Minha Carteira", () => {
		render(<WalletCard wallet={buildWallet()} />);
		expect(screen.getByText("Minha Carteira")).toBeInTheDocument();
	});

	it("exibe o saldo disponível e pendente quando a carteira é fornecida", () => {
		render(
			<WalletCard wallet={buildWallet({ balance: 200, pendingBalance: 40 })} />,
		);
		expect(screen.getByText("R$ 200,00")).toBeInTheDocument();
		expect(screen.getByText("R$ 40,00")).toBeInTheDocument();
	});

	it("exibe skeleton de carregamento quando isLoading é true", () => {
		const { container } = render(
			<WalletCard wallet={buildWallet()} isLoading />,
		);
		expect(
			container.querySelectorAll('[class*="animate-pulse"]').length,
		).toBeGreaterThan(0);
		expect(screen.queryByText("Disponivel")).not.toBeInTheDocument();
	});

	it("exibe skeleton de carregamento quando wallet não é fornecida", () => {
		render(<WalletCard />);
		expect(screen.queryByText("Disponivel")).not.toBeInTheDocument();
		expect(screen.queryByText("Pendente")).not.toBeInTheDocument();
	});

	it("não exibe skeleton quando a carteira já carregou e isLoading é false", () => {
		render(<WalletCard wallet={buildWallet()} isLoading={false} />);
		expect(screen.getByText("Disponivel")).toBeInTheDocument();
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});
});
