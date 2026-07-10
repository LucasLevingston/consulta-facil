import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const refetch = vi.fn();

vi.mock("@/components/procedure-requests/hooks", () => ({
	useGetMyProcedureRequests: vi.fn(),
}));
vi.mock("@/components/professionals/hooks", () => ({
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
vi.mock("./ProfessionalRequestCard", () => ({
	ProfessionalRequestCard: ({ request }: { request: { id: string } }) => (
		<div>card-profissional-{request.id}</div>
	),
}));
vi.mock("./CreateProcedureRequestForm", () => ({
	CreateProcedureRequestForm: () => <div>form-criar-solicitacao</div>,
}));

import { useGetMyProcedureRequests } from "@/components/procedure-requests/hooks";
import { useApplicationStatus } from "@/components/professionals/hooks";
import { ProfessionalRequestsView } from "./ProfessionalRequestsView";
import { ProfessionalView } from "./ProfessionalView";

const requests = [
	{ id: "r-1", serviceName: "Ultrassom" },
	{ id: "r-2", serviceName: "Raio-X" },
];

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
