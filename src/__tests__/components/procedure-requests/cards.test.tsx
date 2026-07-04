import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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
vi.mock("@/components/procedure-requests/StatusBadge", () => ({
	StatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));
vi.mock("@/components/procedure-requests/PatientRequestActions", () => ({
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

import { PatientRequestCard } from "@/components/procedure-requests/PatientRequestCard";
import { ProfessionalRequestCard } from "@/components/procedure-requests/ProfessionalRequestCard";

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

describe("PatientRequestCard", () => {
	beforeEachClears();

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
});

describe("ProfessionalRequestCard", () => {
	beforeEachClears();

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

function beforeEachClears() {
	beforeEach(() => {
		cancelMutateAsync.mockReset();
		toastSuccess.mockReset();
		toastError.mockReset();
	});
}
