import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProfessionalResponse } from "@/features/professionals";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", () => ({
	usePendingApplications: vi.fn(),
	useApproveApplication: vi.fn(() => ({
		mutateAsync: vi.fn(),
		isPending: false,
	})),
	useRejectApplication: vi.fn(() => ({
		mutateAsync: vi.fn(),
		isPending: false,
	})),
}));

import { PendingApplicationsContent } from "@/components/admin/PendingApplicationsContent";
import { usePendingApplications } from "@/features/professionals";

const mockUsePendingApplications = vi.mocked(usePendingApplications);

function makeProfessional(
	overrides: Partial<ProfessionalResponse> = {},
): ProfessionalResponse {
	return {
		id: "prof-1",
		name: "Dra. Ana",
		email: "ana@example.com",
		specialty: "DERMATOLOGIA",
		imageUrl: null,
		...overrides,
	} as ProfessionalResponse;
}

describe("PendingApplicationsContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("mostra mensagem de lista vazia quando não há solicitações pendentes", () => {
		mockUsePendingApplications.mockReturnValue({
			data: { content: [] },
		} as never);

		render(<PendingApplicationsContent />);

		expect(
			screen.getByText("Nenhuma solicitação pendente"),
		).toBeInTheDocument();
	});

	it("renderiza um card por solicitação pendente", () => {
		mockUsePendingApplications.mockReturnValue({
			data: {
				content: [
					makeProfessional({ id: "p1", name: "Dra. Ana" }),
					makeProfessional({ id: "p2", name: "Dr. Bruno" }),
				],
			},
		} as never);

		render(<PendingApplicationsContent />);

		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
		expect(screen.getByText("Dr. Bruno")).toBeInTheDocument();
	});

	it("chama usePendingApplications com paginação (0, 50)", () => {
		mockUsePendingApplications.mockReturnValue({
			data: { content: [] },
		} as never);

		render(<PendingApplicationsContent />);

		expect(mockUsePendingApplications).toHaveBeenCalledWith(0, 50);
	});
});
