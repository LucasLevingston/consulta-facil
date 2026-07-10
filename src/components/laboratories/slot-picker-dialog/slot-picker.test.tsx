import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExamLabResponse } from "@/features/exams";

// Mock dos hooks de API usados internamente pelo SlotPickerDialog — o teste
// não deve chegar até @/config/api.
vi.mock("@/features/exams", () => ({
	useAvailableSlots: vi.fn(),
	useScheduleExam: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({
		children,
		open,
		onOpenChange,
	}: {
		children: React.ReactNode;
		open: boolean;
		onOpenChange?: (v: boolean) => void;
	}) =>
		open ? (
			<div>
				<button
					type="button"
					data-testid="dialog-close"
					onClick={() => onOpenChange?.(false)}
				>
					fechar dialog
				</button>
				{children}
			</div>
		) : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { toast } from "sonner";
import { useAvailableSlots, useScheduleExam } from "@/features/exams";
import { SlotConfirmation } from "./SlotConfirmation";
import { SlotDatePicker } from "./SlotDatePicker";
import { SlotPickerDialog } from "./SlotPickerDialog";
import { SlotTimePicker } from "./SlotTimePicker";

const mockUseAvailableSlots = vi.mocked(useAvailableSlots);
const mockUseScheduleExam = vi.mocked(useScheduleExam);

const baseLab: ExamLabResponse = {
	id: "lab-1",
	name: "Laboratório Central",
	description: null,
	phone: null,
	address: "Rua das Análises, 50",
	city: "João Pessoa",
	state: "PB",
	zipCode: null,
	latitude: null,
	longitude: null,
	imageUrl: null,
	acceptedExams: [],
	status: "ACTIVE",
	hours: [],
	createdAt: null,
};

describe("SlotDatePicker", () => {
	it("renderiza o rótulo 'Escolha a data'", () => {
		render(<SlotDatePicker selectedDate={undefined} onSelect={vi.fn()} />);
		expect(screen.getByText("Escolha a data")).toBeInTheDocument();
	});

	it("chama onSelect ao escolher uma data no calendário", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(<SlotDatePicker selectedDate={undefined} onSelect={onSelect} />);
		// O calendário real (react-day-picker) renderiza um grid de botões de dia;
		// selecionamos o primeiro dia disponível (não desabilitado) do mês atual.
		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		expect(dayButtons.length).toBeGreaterThan(0);
		await user.click(dayButtons[0]);
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect.mock.calls[0][0]).toBeInstanceOf(Date);
	});
});

describe("SlotTimePicker", () => {
	it("mostra o indicador de carregamento quando slotsLoading é true", () => {
		render(
			<SlotTimePicker
				slots={[]}
				slotsLoading={true}
				selectedTime={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("Horários disponíveis")).toBeInTheDocument();
	});

	it("mostra mensagem de laboratório fechado quando não há horários", () => {
		render(
			<SlotTimePicker
				slots={[]}
				slotsLoading={false}
				selectedTime={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(
			screen.getByText("Laboratório fechado nesta data."),
		).toBeInTheDocument();
	});

	it("mostra mensagem de todos os horários ocupados quando nenhum slot está disponível", () => {
		render(
			<SlotTimePicker
				slots={[{ time: "09:00:00", available: false }]}
				slotsLoading={false}
				selectedTime={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(
			screen.getByText("Todos os horários estão ocupados nesta data."),
		).toBeInTheDocument();
	});

	it("renderiza os horários formatados e desabilita os indisponíveis", () => {
		render(
			<SlotTimePicker
				slots={[
					{ time: "09:00:00", available: true },
					{ time: "10:00:00", available: false },
				]}
				slotsLoading={false}
				selectedTime={null}
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("09:00")).toBeInTheDocument();
		expect(screen.getByText("10:00").closest("button")).toBeDisabled();
	});

	it("chama onSelect ao clicar em um horário disponível", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(
			<SlotTimePicker
				slots={[{ time: "09:00:00", available: true }]}
				slotsLoading={false}
				selectedTime={null}
				onSelect={onSelect}
			/>,
		);
		await user.click(screen.getByText("09:00"));
		expect(onSelect).toHaveBeenCalledWith("09:00:00");
	});

	it("não chama onSelect ao clicar em um horário indisponível", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(
			<SlotTimePicker
				slots={[{ time: "10:00:00", available: false }]}
				slotsLoading={false}
				selectedTime={null}
				onSelect={onSelect}
			/>,
		);
		await user.click(screen.getByText("10:00"));
		expect(onSelect).not.toHaveBeenCalled();
	});

	it("marca aria-pressed=true no horário selecionado", () => {
		render(
			<SlotTimePicker
				slots={[{ time: "09:00:00", available: true }]}
				slotsLoading={false}
				selectedTime="09:00:00"
				onSelect={vi.fn()}
			/>,
		);
		expect(screen.getByText("09:00").closest("button")).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});
});

describe("SlotConfirmation", () => {
	const selectedDate = new Date(2026, 6, 10); // 10/07/2026

	it("renderiza o resumo do agendamento com data e hora formatadas", () => {
		render(
			<SlotConfirmation
				selectedDate={selectedDate}
				selectedTime="09:30:00"
				isPending={false}
				onConfirm={vi.fn()}
			/>,
		);
		expect(screen.getByText("Resumo do agendamento")).toBeInTheDocument();
		expect(screen.getByText(/às 09:30/)).toBeInTheDocument();
	});

	it("mostra 'Confirmar agendamento' quando não está pendente", () => {
		render(
			<SlotConfirmation
				selectedDate={selectedDate}
				selectedTime="09:30:00"
				isPending={false}
				onConfirm={vi.fn()}
			/>,
		);
		expect(screen.getByText("Confirmar agendamento")).toBeInTheDocument();
	});

	it("mostra 'Agendando...' e desabilita o botão quando isPending é true", () => {
		render(
			<SlotConfirmation
				selectedDate={selectedDate}
				selectedTime="09:30:00"
				isPending={true}
				onConfirm={vi.fn()}
			/>,
		);
		expect(screen.getByText("Agendando...")).toBeInTheDocument();
		expect(screen.getByText("Agendando...").closest("button")).toBeDisabled();
	});

	it("chama onConfirm ao clicar no botão de confirmação", async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn();
		render(
			<SlotConfirmation
				selectedDate={selectedDate}
				selectedTime="09:30:00"
				isPending={false}
				onConfirm={onConfirm}
			/>,
		);
		await user.click(screen.getByText("Confirmar agendamento"));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});
});

describe("SlotPickerDialog", () => {
	const mutateAsync = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseAvailableSlots.mockReturnValue({
			data: [{ time: "09:00:00", available: true }],
			isLoading: false,
		} as never);
		mockUseScheduleExam.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
	});

	it("não renderiza nada quando open é false", () => {
		const { container } = render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={false}
				onClose={vi.fn()}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("renderiza o nome e o endereço do laboratório no título", () => {
		render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={true}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Laboratório Central")).toBeInTheDocument();
		expect(
			screen.getByText("Rua das Análises, 50, João Pessoa"),
		).toBeInTheDocument();
	});

	it("não mostra o seletor de horário antes de escolher uma data", () => {
		render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={true}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Horários disponíveis")).not.toBeInTheDocument();
	});

	it("mostra o seletor de horário após escolher uma data", async () => {
		const user = userEvent.setup();
		render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={true}
				onClose={vi.fn()}
			/>,
		);
		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		await user.click(dayButtons[0]);
		expect(screen.getByText("Horários disponíveis")).toBeInTheDocument();
	});

	it("mostra o resumo de confirmação após escolher data e horário", async () => {
		const user = userEvent.setup();
		render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={true}
				onClose={vi.fn()}
			/>,
		);
		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		await user.click(dayButtons[0]);
		await user.click(screen.getByText("09:00"));
		expect(screen.getByText("Resumo do agendamento")).toBeInTheDocument();
	});

	it("agenda o exame com sucesso e fecha o dialog ao confirmar", async () => {
		const user = userEvent.setup();
		mutateAsync.mockResolvedValueOnce({});
		const onClose = vi.fn();
		render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={true}
				onClose={onClose}
			/>,
		);
		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		await user.click(dayButtons[0]);
		await user.click(screen.getByText("09:00"));
		await user.click(screen.getByText("Confirmar agendamento"));

		expect(mutateAsync).toHaveBeenCalledWith(
			expect.objectContaining({
				examRequestId: "req-1",
				examLabId: "lab-1",
				scheduledTime: "09:00:00",
			}),
		);
		expect(toast.success).toHaveBeenCalledWith("Exame agendado com sucesso!");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("mostra erro e não fecha o dialog quando o agendamento falha", async () => {
		const user = userEvent.setup();
		mutateAsync.mockRejectedValueOnce(new Error("falhou"));
		const onClose = vi.fn();
		render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={true}
				onClose={onClose}
			/>,
		);
		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		await user.click(dayButtons[0]);
		await user.click(screen.getByText("09:00"));
		await user.click(screen.getByText("Confirmar agendamento"));

		expect(toast.error).toHaveBeenCalledWith(
			"Erro ao agendar exame. Tente novamente.",
		);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("chama onClose ao fechar o dialog", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<SlotPickerDialog
				lab={baseLab}
				examRequestId="req-1"
				open={true}
				onClose={onClose}
			/>,
		);
		await user.click(screen.getByTestId("dialog-close"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
