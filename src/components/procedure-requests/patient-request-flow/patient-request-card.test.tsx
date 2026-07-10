import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { cancelMutateAsync, toastSuccess, toastError } = vi.hoisted(() => ({
	cancelMutateAsync: vi.fn(),
	toastSuccess: vi.fn(),
	toastError: vi.fn(),
}));

vi.mock("@/features/procedure-requests", () => ({
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
vi.mock("./PatientRequestActions", () => ({
	PatientRequestActions: ({
		canSchedule,
		canCancel,
		canceling,
		onCancel,
	}: {
		canSchedule: boolean;
		canCancel: boolean;
		canceling: boolean;
		onCancel: () => void;
	}) => (
		<div>
			{canSchedule && <span>pode-agendar</span>}
			{canCancel && (
				<button type="button" onClick={onCancel} disabled={canceling}>
					Cancelar
				</button>
			)}
		</div>
	),
}));

import { PatientRequestCard } from "./PatientRequestCard";

const patientCardRequest = {
	id: "req-1",
	serviceName: "Ultrassom",
	professionalName: "Dr. Silva",
	professionalId: "prof-1",
	status: "PENDING",
	servicePrice: 150,
	serviceDurationMinutes: 30,
	notes: null,
};

describe("PatientRequestCard", () => {
	beforeEach(() => {
		cancelMutateAsync.mockReset();
		toastSuccess.mockReset();
		toastError.mockReset();
	});

	it("renderiza nome do serviço e do profissional", () => {
		render(<PatientRequestCard request={patientCardRequest as never} />);
		expect(screen.getByText("Ultrassom")).toBeInTheDocument();
		expect(screen.getByText(/Dr. Silva/)).toBeInTheDocument();
	});

	it("renderiza ação de agendar quando status é PENDING", () => {
		render(<PatientRequestCard request={patientCardRequest as never} />);
		expect(screen.getByText("pode-agendar")).toBeInTheDocument();
	});

	it("não renderiza ação de cancelar quando status é COMPLETED", () => {
		const req = { ...patientCardRequest, status: "COMPLETED" };
		render(<PatientRequestCard request={req as never} />);
		expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
	});

	it("chama mutation de cancelamento e mostra toast de sucesso ao clicar em Cancelar", async () => {
		cancelMutateAsync.mockResolvedValueOnce(undefined);
		render(<PatientRequestCard request={patientCardRequest as never} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(cancelMutateAsync).toHaveBeenCalledWith("req-1");
		expect(toastSuccess).toHaveBeenCalledWith("Solicitação cancelada.");
	});

	it("mostra toast de erro quando cancelamento falha", async () => {
		cancelMutateAsync.mockRejectedValueOnce(new Error("falha"));
		render(<PatientRequestCard request={patientCardRequest as never} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(toastError).toHaveBeenCalledWith("Erro ao cancelar solicitação.");
	});

	it("renderiza preço formatado", () => {
		render(<PatientRequestCard request={patientCardRequest as never} />);
		expect(screen.getByText(/150\.00/)).toBeInTheDocument();
	});

	it("renderiza duração em minutos", () => {
		render(<PatientRequestCard request={patientCardRequest as never} />);
		expect(screen.getByText(/30 min/)).toBeInTheDocument();
	});

	it("renderiza observações quando fornecidas", () => {
		const req = {
			...patientCardRequest,
			notes: "Trazer exames anteriores",
		};
		render(<PatientRequestCard request={req as never} />);
		expect(screen.getByText("Trazer exames anteriores")).toBeInTheDocument();
	});

	it("não renderiza observações quando nulo", () => {
		render(<PatientRequestCard request={patientCardRequest as never} />);
		expect(screen.queryByText(/Trazer/)).not.toBeInTheDocument();
	});

	it("renderiza o status badge", () => {
		render(<PatientRequestCard request={patientCardRequest as never} />);
		expect(screen.getByText("PENDING")).toBeInTheDocument();
	});
});
