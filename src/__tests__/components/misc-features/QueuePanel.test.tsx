import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/reception/use-queue", () => ({
	useQueue: vi.fn(),
}));
vi.mock("@/components/reception/use-call-patient", () => ({
	useCallPatient: vi.fn(() => ({
		mutateAsync: vi.fn().mockResolvedValue(undefined),
		isPending: false,
	})),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { QueuePanel } from "@/components/reception/QueuePanel";
import { useQueue } from "@/components/reception/use-queue";

const mockUseQueue = vi.mocked(useQueue);

describe("QueuePanel", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exibe mensagem de carregamento enquanto a fila carrega", () => {
		mockUseQueue.mockReturnValue({
			data: undefined,
			isLoading: true,
			refetch: vi.fn(),
			isFetching: false,
		} as never);
		render(<QueuePanel />);
		expect(screen.getByText("Carregando...")).toBeInTheDocument();
	});

	it("exibe mensagem de fila vazia quando não há pacientes", () => {
		mockUseQueue.mockReturnValue({
			data: [],
			isLoading: false,
			refetch: vi.fn(),
			isFetching: false,
		} as never);
		render(<QueuePanel />);
		expect(screen.getByText("Nenhum paciente na fila.")).toBeInTheDocument();
	});

	it("separa pacientes em atendimento e aguardando em seções distintas", () => {
		mockUseQueue.mockReturnValue({
			data: [
				{
					id: "a-1",
					patientName: "Em Atendimento",
					status: "IN_PROGRESS",
					checkedInAt: null,
				},
				{
					id: "a-2",
					patientName: "Aguardando Fila",
					status: "CHECKED_IN",
					checkedInAt: null,
				},
			],
			isLoading: false,
			refetch: vi.fn(),
			isFetching: false,
		} as never);
		render(<QueuePanel />);
		expect(screen.getAllByText("Em atendimento").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Aguardando").length).toBeGreaterThan(0);
		expect(screen.getByText("Em Atendimento")).toBeInTheDocument();
		expect(screen.getByText("Aguardando Fila")).toBeInTheDocument();
	});

	it("exibe a contagem de pacientes aguardando no título", () => {
		mockUseQueue.mockReturnValue({
			data: [
				{
					id: "a-1",
					patientName: "P1",
					status: "CHECKED_IN",
					checkedInAt: null,
				},
				{
					id: "a-2",
					patientName: "P2",
					status: "CHECKED_IN",
					checkedInAt: null,
				},
			],
			isLoading: false,
			refetch: vi.fn(),
			isFetching: false,
		} as never);
		render(<QueuePanel />);
		expect(screen.getByText("Fila de espera (2)")).toBeInTheDocument();
	});

	it("chama refetch ao clicar no botão de atualizar", async () => {
		const refetch = vi.fn();
		mockUseQueue.mockReturnValue({
			data: [],
			isLoading: false,
			refetch,
			isFetching: false,
		} as never);
		const { container } = render(<QueuePanel />);
		const refreshButton = container.querySelector("button");
		await userEvent.click(refreshButton as HTMLButtonElement);
		expect(refetch).toHaveBeenCalled();
	});
});
