import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/procedure-requests/hooks", () => ({
	useGetMyProcedureRequests: vi.fn(),
}));
vi.mock("./PatientRequestCard", () => ({
	PatientRequestCard: ({ request }: { request: { id: string } }) => (
		<div>card-paciente-{request.id}</div>
	),
}));

import { useGetMyProcedureRequests } from "@/components/procedure-requests/hooks";
import { PatientRequestsView } from "./PatientRequestsView";
import { PatientView } from "./PatientView";

const requests = [
	{ id: "r-1", serviceName: "Ultrassom" },
	{ id: "r-2", serviceName: "Raio-X" },
];

describe("PatientView", () => {
	it("mostra estado vazio quando não há solicitações", () => {
		render(<PatientView requests={[]} />);
		expect(
			screen.getByText("Nenhuma solicitação de procedimento para você."),
		).toBeInTheDocument();
	});

	it("renderiza um card por solicitação quando há dados", () => {
		render(<PatientView requests={requests as never} />);
		expect(screen.getByText("card-paciente-r-1")).toBeInTheDocument();
		expect(screen.getByText("card-paciente-r-2")).toBeInTheDocument();
	});
});

describe("PatientRequestsView", () => {
	it("passa a lista de solicitações do hook para PatientView (estado com dados)", () => {
		vi.mocked(useGetMyProcedureRequests).mockReturnValue({
			data: requests,
		} as never);
		render(<PatientRequestsView />);
		expect(screen.getByText("card-paciente-r-1")).toBeInTheDocument();
	});

	it("mostra estado vazio quando hook retorna lista vazia", () => {
		vi.mocked(useGetMyProcedureRequests).mockReturnValue({
			data: [],
		} as never);
		render(<PatientRequestsView />);
		expect(
			screen.getByText("Nenhuma solicitação de procedimento para você."),
		).toBeInTheDocument();
	});
});
