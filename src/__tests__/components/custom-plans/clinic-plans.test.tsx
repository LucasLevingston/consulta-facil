import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ClinicPlans from "@/components/custom/plans/ClinicPlans";

const mutate = vi.fn();

vi.mock("@/features/clinics", () => ({
	useMyClinic: vi.fn(() => ({ data: [] })),
}));

vi.mock("@/features/subscriptions", () => ({
	useCreateCheckout: vi.fn(() => ({ mutate, isPending: false })),
	useMySubscription: vi.fn(() => ({
		data: null,
		isLoading: false,
		error: null,
	})),
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

import { useMyClinic } from "@/features/clinics";
import { useMySubscription } from "@/features/subscriptions";

describe("ClinicPlans", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exibe as informações de freemium e a calculadora de preço", () => {
		render(<ClinicPlans />);
		expect(screen.getByText(/profissionais grátis/)).toBeInTheDocument();
		expect(screen.getByText("Calculadora de preço")).toBeInTheDocument();
	});

	it("exibe o cartão de uso quando a clínica do usuário existe", () => {
		vi.mocked(useMyClinic).mockReturnValueOnce({
			data: [{ id: "c1", name: "Clínica Vida", members: [] }],
		} as never);
		render(<ClinicPlans />);
		expect(screen.getByText("Clínica Vida")).toBeInTheDocument();
	});

	it("não exibe o cartão de uso quando o usuário não possui clínica", () => {
		render(<ClinicPlans />);
		expect(
			screen.queryByText("Uso atual da sua clínica"),
		).not.toBeInTheDocument();
	});

	it("lista os planos pagos disponíveis (Clínica Mensal e Clínica Anual)", () => {
		render(<ClinicPlans />);
		expect(screen.getByText("Clínica Mensal")).toBeInTheDocument();
		expect(screen.getByText("Clínica Anual")).toBeInTheDocument();
	});

	it("exibe o banner de assinatura quando há assinatura ativa de clínica", () => {
		vi.mocked(useMySubscription).mockReturnValueOnce({
			data: {
				id: "sub1",
				planId: "clinic-monthly",
				status: "ACTIVE",
				expiresAt: null,
				createdAt: new Date().toISOString(),
			},
			isLoading: false,
			error: null,
		} as never);
		render(<ClinicPlans />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();
	});

	it("chama checkout.mutate com o planId ao clicar em 'Assinar agora'", async () => {
		render(<ClinicPlans />);
		const buttons = screen.getAllByText("Assinar agora");
		await userEvent.click(buttons[0]);
		expect(mutate).toHaveBeenCalledWith(
			"clinic-monthly",
			expect.objectContaining({ onError: expect.any(Function) }),
		);
	});
});
