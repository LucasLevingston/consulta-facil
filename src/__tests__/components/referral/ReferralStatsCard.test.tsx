import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import type { ReferralStatsResponse } from "@/features/billing";

describe("ReferralStatsCard", () => {
	const stats: ReferralStatsResponse = {
		code: "ABC123",
		totalReferred: 10,
		pendingCommissions: 3,
		availableCommissions: 7,
		pendingBalance: 150,
		availableBalance: 350,
	};

	it("renderiza os rotulos de todas as estatisticas", () => {
		render(<ReferralStatsCard stats={stats} />);

		expect(screen.getByText("Total Indicados")).toBeInTheDocument();
		expect(screen.getByText("Comissoes Pendentes")).toBeInTheDocument();
		expect(screen.getByText("Comissoes Disponiveis")).toBeInTheDocument();
		expect(screen.getByText("Saldo Disponivel")).toBeInTheDocument();
	});

	it("renderiza os valores numericos corretamente", () => {
		render(<ReferralStatsCard stats={stats} />);

		expect(screen.getByText("10")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
		expect(screen.getByText("7")).toBeInTheDocument();
	});

	it("formata o saldo disponivel como moeda BRL", () => {
		render(<ReferralStatsCard stats={stats} />);

		expect(screen.getByText(/R\$/)).toBeInTheDocument();
	});
});
