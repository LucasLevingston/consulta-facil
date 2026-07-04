import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProfessionalResponse } from "@/features/professionals";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", () => ({
	useApproveApplication: vi.fn(),
	useRejectApplication: vi.fn(),
}));

import { toast } from "sonner";
import { PendingApplicationCard } from "@/components/admin/PendingApplicationCard";
import {
	useApproveApplication,
	useRejectApplication,
} from "@/features/professionals";

const mockUseApprove = vi.mocked(useApproveApplication);
const mockUseReject = vi.mocked(useRejectApplication);

function makeProfessional(
	overrides: Partial<ProfessionalResponse> = {},
): ProfessionalResponse {
	return {
		id: "prof-1",
		name: "Dr. Carlos",
		email: "carlos@example.com",
		specialty: "CARDIOLOGIA",
		imageUrl: null,
		...overrides,
	} as ProfessionalResponse;
}

describe("PendingApplicationCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseApprove.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
		mockUseReject.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
	});

	it("renderiza o nome, email e especialidade do profissional", () => {
		render(<PendingApplicationCard professional={makeProfessional()} />);

		expect(screen.getByText("Dr. Carlos")).toBeInTheDocument();
		expect(screen.getByText("carlos@example.com")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("aprova a solicitação ao clicar em Aprovar e mostra toast de sucesso", async () => {
		const user = userEvent.setup();
		const approve = vi.fn().mockResolvedValue(undefined);
		mockUseApprove.mockReturnValue({
			mutateAsync: approve,
			isPending: false,
		} as never);

		render(<PendingApplicationCard professional={makeProfessional()} />);
		await user.click(screen.getByRole("button", { name: /Aprovar/ }));

		expect(approve).toHaveBeenCalledWith("prof-1");
		expect(toast.success).toHaveBeenCalledWith(
			"Dr. Carlos aprovado com sucesso",
		);
	});

	it("mostra toast de erro quando a aprovação falha", async () => {
		const user = userEvent.setup();
		const approve = vi.fn().mockRejectedValue(new Error("falhou"));
		mockUseApprove.mockReturnValue({
			mutateAsync: approve,
			isPending: false,
		} as never);

		render(<PendingApplicationCard professional={makeProfessional()} />);
		await user.click(screen.getByRole("button", { name: /Aprovar/ }));

		expect(
			await screen.findByRole("button", { name: /Aprovar/ }),
		).toBeInTheDocument();
		expect(toast.error).toHaveBeenCalledWith("Erro ao aprovar solicitação");
	});

	it("rejeita a solicitação ao clicar em Recusar e mostra toast de sucesso", async () => {
		const user = userEvent.setup();
		const reject = vi.fn().mockResolvedValue(undefined);
		mockUseReject.mockReturnValue({
			mutateAsync: reject,
			isPending: false,
		} as never);

		render(<PendingApplicationCard professional={makeProfessional()} />);
		await user.click(screen.getByRole("button", { name: /Recusar/ }));

		expect(reject).toHaveBeenCalledWith("prof-1");
		expect(toast.success).toHaveBeenCalledWith("Solicitação recusada");
	});

	it("desabilita os dois botões enquanto uma ação está pendente", () => {
		mockUseApprove.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);

		render(<PendingApplicationCard professional={makeProfessional()} />);
		expect(screen.getByRole("button", { name: /Recusar/ })).toBeDisabled();
		expect(screen.getByRole("button", { name: /Aprovar/ })).toBeDisabled();
	});
});
