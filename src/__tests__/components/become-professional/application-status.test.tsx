import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({
	useApplicationStatus: vi.fn(),
}));
vi.mock("@/components/become-professional/BecomeProfessionalForm", () => ({
	BecomeProfessionalForm: () => <div>BecomeProfessionalForm</div>,
}));
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));

import { ApplicationStatus } from "@/components/become-professional/ApplicationStatus";
import { useApplicationStatus } from "@/features/professionals";

const mockUseApplicationStatus = vi.mocked(useApplicationStatus);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("ApplicationStatus", () => {
	it("não renderiza nada enquanto isLoading é true", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
		} as never);
		const { container } = render(<ApplicationStatus />);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza o formulário de candidatura quando há erro na consulta", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: new Error("falhou"),
		} as never);
		render(<ApplicationStatus />);
		expect(screen.getByText("BecomeProfessionalForm")).toBeInTheDocument();
	});

	it("renderiza o formulário de candidatura quando não há candidatura", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
		} as never);
		render(<ApplicationStatus />);
		expect(screen.getByText("BecomeProfessionalForm")).toBeInTheDocument();
	});

	it("mostra o estado 'Cadastro em análise' quando o status é PENDING_REVIEW", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: {
				status: "PENDING_REVIEW",
				profession: "MEDICO",
				specialty: "CARDIOLOGIA",
			},
			isLoading: false,
			error: null,
		} as never);
		render(<ApplicationStatus />);
		expect(screen.getByText("Cadastro em análise")).toBeInTheDocument();
		expect(screen.getByText("Médico")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
		expect(screen.getByText("Voltar ao início")).toBeInTheDocument();
	});

	it("não mostra o bloco de profissão quando profession não é informada em PENDING_REVIEW", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: { status: "PENDING_REVIEW", specialty: "CARDIOLOGIA" },
			isLoading: false,
			error: null,
		} as never);
		render(<ApplicationStatus />);
		expect(screen.queryByText("Profissão")).not.toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("mostra o estado 'Cadastro não aprovado' quando o status é REJECTED", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: {
				status: "REJECTED",
				profession: "DENTISTA",
				specialty: "ORTODONTIA",
			},
			isLoading: false,
			error: null,
		} as never);
		render(<ApplicationStatus />);
		expect(screen.getByText("Cadastro não aprovado")).toBeInTheDocument();
		expect(screen.getByText("Voltar ao início")).toBeInTheDocument();
	});

	it("renderiza o formulário de candidatura para status desconhecido (ex.: APPROVED)", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: {
				status: "APPROVED",
				profession: "MEDICO",
				specialty: "CARDIOLOGIA",
			},
			isLoading: false,
			error: null,
		} as never);
		render(<ApplicationStatus />);
		expect(screen.getByText("BecomeProfessionalForm")).toBeInTheDocument();
	});
});
