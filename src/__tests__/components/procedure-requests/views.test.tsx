import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const refetch = vi.fn();

vi.mock("@/features/procedure-requests", () => ({
	useGetMyProcedureRequests: vi.fn(),
}));
vi.mock("@/features/professionals", () => ({
	useApplicationStatus: vi.fn(),
}));
vi.mock("@/components/custom/loading/loading-page", () => ({
	LoadingPage: () => <div>carregando...</div>,
}));
vi.mock("@/components/custom/error-state/error-state", () => ({
	ErrorState: ({ onRetry }: { onRetry: () => void }) => (
		<div>
			<span>erro ao carregar</span>
			<button type="button" onClick={onRetry}>
				Tentar novamente
			</button>
		</div>
	),
}));
vi.mock("@/components/custom/suspense-boundary/suspense-boundary", () => ({
	SuspenseBoundary: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));
vi.mock("@/components/procedure-requests/PatientRequestCard", () => ({
	PatientRequestCard: ({ request }: { request: { id: string } }) => (
		<div>card-paciente-{request.id}</div>
	),
}));
vi.mock("@/components/procedure-requests/ProfessionalRequestCard", () => ({
	ProfessionalRequestCard: ({ request }: { request: { id: string } }) => (
		<div>card-profissional-{request.id}</div>
	),
}));
vi.mock("@/components/procedure-requests/CreateProcedureRequestForm", () => ({
	CreateProcedureRequestForm: () => <div>form-criar-solicitacao</div>,
}));

import { PatientRequestsView } from "@/components/procedure-requests/PatientRequestsView";
import { PatientView } from "@/components/procedure-requests/PatientView";
import { ProcedureRequestsContent } from "@/components/procedure-requests/ProcedureRequestsContent";
import { ProfessionalRequestsView } from "@/components/procedure-requests/ProfessionalRequestsView";
import { ProfessionalView } from "@/components/procedure-requests/ProfessionalView";
import { useGetMyProcedureRequests } from "@/features/procedure-requests";
import { useApplicationStatus } from "@/features/professionals";

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

describe("ProfessionalView", () => {
	it("mostra estado vazio quando não há solicitações", () => {
		render(<ProfessionalView requests={[]} professionalId="prof-1" />);
		expect(
			screen.getByText("Nenhuma solicitação criada ainda."),
		).toBeInTheDocument();
	});

	it("renderiza um card por solicitação quando há dados", () => {
		render(
			<ProfessionalView requests={requests as never} professionalId="prof-1" />,
		);
		expect(screen.getByText("card-profissional-r-1")).toBeInTheDocument();
		expect(screen.getByText("card-profissional-r-2")).toBeInTheDocument();
	});

	it("renderiza botão de nova solicitação", () => {
		render(<ProfessionalView requests={[]} professionalId="prof-1" />);
		expect(screen.getByText("Nova solicitação")).toBeInTheDocument();
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

describe("ProfessionalRequestsView", () => {
	beforeEach(() => {
		vi.mocked(useGetMyProcedureRequests).mockReturnValue({
			data: requests,
		} as never);
	});

	it("mostra estado de carregamento quando perfil está carregando", () => {
		vi.mocked(useApplicationStatus).mockReturnValue({
			isLoading: true,
			error: null,
			data: null,
			refetch,
		} as never);
		render(<ProfessionalRequestsView />);
		expect(screen.getByText("carregando...")).toBeInTheDocument();
	});

	it("mostra estado de erro quando perfil falha ao carregar", () => {
		vi.mocked(useApplicationStatus).mockReturnValue({
			isLoading: false,
			error: new Error("falha"),
			data: null,
			refetch,
		} as never);
		render(<ProfessionalRequestsView />);
		expect(screen.getByText("erro ao carregar")).toBeInTheDocument();
	});

	it("renderiza ProfessionalView quando perfil carrega com sucesso", () => {
		vi.mocked(useApplicationStatus).mockReturnValue({
			isLoading: false,
			error: null,
			data: { id: "prof-1" },
			refetch,
		} as never);
		render(<ProfessionalRequestsView />);
		expect(screen.getByText("card-profissional-r-1")).toBeInTheDocument();
	});
});

describe("ProcedureRequestsContent", () => {
	beforeEach(() => {
		vi.mocked(useGetMyProcedureRequests).mockReturnValue({
			data: [],
		} as never);
		vi.mocked(useApplicationStatus).mockReturnValue({
			isLoading: false,
			error: null,
			data: { id: "prof-1" },
			refetch,
		} as never);
	});

	it("renderiza a view do paciente quando isProfessional=false", () => {
		render(<ProcedureRequestsContent isProfessional={false} />);
		expect(
			screen.getByText("Nenhuma solicitação de procedimento para você."),
		).toBeInTheDocument();
	});

	it("renderiza a view do profissional quando isProfessional=true", () => {
		render(<ProcedureRequestsContent isProfessional={true} />);
		expect(
			screen.getByText("Nenhuma solicitação criada ainda."),
		).toBeInTheDocument();
	});
});
