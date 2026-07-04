import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/appointments", () => ({
	useCallPatient: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { toast } from "sonner";
import { QueueCard } from "@/components/reception/QueueCard";
import { useCallPatient } from "@/features/appointments";

const mockUseCallPatient = vi.mocked(useCallPatient);

const baseAppointment = {
	id: "a-1",
	patientName: "Carlos Pereira",
	status: "CHECKED_IN",
	checkedInAt: "2026-07-04T09:30:00Z",
} as never;

describe("QueueCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseCallPatient.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue(undefined),
			isPending: false,
		} as never);
	});

	it("renderiza o nome do paciente", () => {
		render(<QueueCard appointment={baseAppointment} />);
		expect(screen.getByText("Carlos Pereira")).toBeInTheDocument();
	});

	it("exibe o badge 'Aguardando' quando o status é CHECKED_IN", () => {
		render(<QueueCard appointment={baseAppointment} />);
		expect(screen.getByText("Aguardando")).toBeInTheDocument();
	});

	it("exibe o badge 'Em atendimento' quando o status é IN_PROGRESS", () => {
		render(
			<QueueCard appointment={{ ...baseAppointment, status: "IN_PROGRESS" }} />,
		);
		expect(screen.getByText("Em atendimento")).toBeInTheDocument();
	});

	it("mostra o botão Chamar apenas quando o status é CHECKED_IN", () => {
		render(<QueueCard appointment={baseAppointment} />);
		expect(screen.getByText("Chamar")).toBeInTheDocument();
	});

	it("não mostra o botão Chamar quando o status é IN_PROGRESS", () => {
		render(
			<QueueCard appointment={{ ...baseAppointment, status: "IN_PROGRESS" }} />,
		);
		expect(screen.queryByText("Chamar")).not.toBeInTheDocument();
	});

	it("chama call.mutateAsync com o id da consulta ao clicar em Chamar", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseCallPatient.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<QueueCard appointment={baseAppointment} />);

		await userEvent.click(screen.getByText("Chamar"));

		expect(mutateAsync).toHaveBeenCalledWith("a-1");
		expect(toast.success).toHaveBeenCalledWith("Carlos Pereira chamado!");
	});

	it("exibe erro quando falha ao chamar o paciente", async () => {
		const mutateAsync = vi.fn().mockRejectedValue(new Error("falhou"));
		mockUseCallPatient.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<QueueCard appointment={baseAppointment} />);

		await userEvent.click(screen.getByText("Chamar"));

		expect(toast.error).toHaveBeenCalledWith("Erro ao chamar paciente.");
	});
});
