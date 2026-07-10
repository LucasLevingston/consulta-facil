import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { cancelMutateAsync, toastSuccess, toastError } = vi.hoisted(() => ({
	cancelMutateAsync: vi.fn(),
	toastSuccess: vi.fn(),
	toastError: vi.fn(),
}));

vi.mock("@/components/procedure-requests/hooks", () => ({
	useCancelProcedureRequest: vi.fn(() => ({
		mutateAsync: cancelMutateAsync,
		isPending: false,
	})),
}));
vi.mock("sonner", () => ({
	toast: { success: toastSuccess, error: toastError },
}));
vi.mock("@/components/procedure-requests/status-badge", () => ({
	StatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));

import { ProfessionalRequestCard } from "./ProfessionalRequestCard";

const professionalCardRequest = {
	id: "req-2",
	serviceName: "Raio-X",
	patientName: "Maria Souza",
	patientId: "pat-1",
	status: "PENDING",
	servicePrice: 90,
	serviceDurationMinutes: 20,
	notes: null,
};

describe("ProfessionalRequestCard", () => {
	beforeEach(() => {
		cancelMutateAsync.mockReset();
		toastSuccess.mockReset();
		toastError.mockReset();
	});

	it("renderiza nome do serviço e do paciente", () => {
		render(
			<ProfessionalRequestCard request={professionalCardRequest as never} />,
		);
		expect(screen.getByText("Raio-X")).toBeInTheDocument();
		expect(screen.getByText(/Maria Souza/)).toBeInTheDocument();
	});

	it("renderiza preço e duração formatados", () => {
		render(
			<ProfessionalRequestCard request={professionalCardRequest as never} />,
		);
		expect(screen.getByText(/90\.00/)).toBeInTheDocument();
		expect(screen.getByText(/20 min/)).toBeInTheDocument();
	});

	it("renderiza botão Cancelar quando status permite cancelamento", () => {
		render(
			<ProfessionalRequestCard request={professionalCardRequest as never} />,
		);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("não renderiza botão Cancelar quando status é COMPLETED", () => {
		const req = { ...professionalCardRequest, status: "COMPLETED" };
		render(<ProfessionalRequestCard request={req as never} />);
		expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
	});

	it("chama mutation de cancelamento ao clicar em Cancelar", async () => {
		cancelMutateAsync.mockResolvedValueOnce(undefined);
		render(
			<ProfessionalRequestCard request={professionalCardRequest as never} />,
		);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(cancelMutateAsync).toHaveBeenCalledWith("req-2");
		expect(toastSuccess).toHaveBeenCalledWith("Solicitação cancelada.");
	});
});
