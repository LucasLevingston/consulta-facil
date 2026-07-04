import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth", () => ({
	usePermission: vi.fn(),
}));
vi.mock("@/features/schedule", () => ({
	useMySchedule: vi.fn(),
}));
vi.mock("@/providers/query-boundary", () => ({
	QueryBoundary: ({
		children,
		isLoading,
		error,
	}: {
		children: React.ReactNode;
		isLoading: boolean;
		error: unknown;
	}) =>
		isLoading ? (
			<div data-testid="loading" />
		) : error ? (
			<div data-testid="error">Erro ao carregar dados</div>
		) : (
			<div>{children}</div>
		),
}));
vi.mock("@/components/schedule/ScheduleEditor", () => ({
	ScheduleEditor: ({ savedSchedule }: { savedSchedule: unknown[] }) => (
		<div>ScheduleEditor:{savedSchedule.length}</div>
	),
}));

import { ScheduleContent } from "@/components/schedule/ScheduleContent";
import { usePermission } from "@/features/auth";
import { useMySchedule } from "@/features/schedule";

const mockUsePermission = vi.mocked(usePermission);
const mockUseMySchedule = vi.mocked(useMySchedule);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("ScheduleContent", () => {
	it("mostra mensagem de acesso negado quando o usuário não é profissional", () => {
		mockUsePermission.mockReturnValue({ can: () => false } as never);
		mockUseMySchedule.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
		} as never);
		render(<ScheduleContent />);
		expect(
			screen.getByText(
				"Apenas profissionais podem configurar horários de atendimento.",
			),
		).toBeInTheDocument();
	});

	it("mostra o estado de carregamento quando o usuário é profissional", () => {
		mockUsePermission.mockReturnValue({ can: () => true } as never);
		mockUseMySchedule.mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
		} as never);
		render(<ScheduleContent />);
		expect(screen.getByTestId("loading")).toBeInTheDocument();
	});

	it("mostra erro ao carregar quando a query falha", () => {
		mockUsePermission.mockReturnValue({ can: () => true } as never);
		mockUseMySchedule.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: new Error("falhou"),
		} as never);
		render(<ScheduleContent />);
		expect(screen.getByTestId("error")).toHaveTextContent(
			"Erro ao carregar dados",
		);
	});

	it("renderiza o ScheduleEditor com os horários carregados quando é profissional", () => {
		mockUsePermission.mockReturnValue({ can: () => true } as never);
		mockUseMySchedule.mockReturnValue({
			data: [{ dayOfWeek: "MONDAY" }],
			isLoading: false,
			error: null,
		} as never);
		render(<ScheduleContent />);
		expect(screen.getByText("ScheduleEditor:1")).toBeInTheDocument();
	});

	it("chama useMySchedule com isProfessional=false quando o usuário não pode gerenciar a agenda", () => {
		mockUsePermission.mockReturnValue({ can: () => false } as never);
		mockUseMySchedule.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
		} as never);
		render(<ScheduleContent />);
		expect(mockUseMySchedule).toHaveBeenCalledWith(false);
	});
});
