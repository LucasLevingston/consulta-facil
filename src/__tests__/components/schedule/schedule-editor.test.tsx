import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/schedule", () => ({
	DAYS_OF_WEEK: [
		"MONDAY",
		"TUESDAY",
		"WEDNESDAY",
		"THURSDAY",
		"FRIDAY",
		"SATURDAY",
		"SUNDAY",
	],
	DAY_LABELS: {
		MONDAY: "Segunda",
		TUESDAY: "Terça",
		WEDNESDAY: "Quarta",
		THURSDAY: "Quinta",
		FRIDAY: "Sexta",
		SATURDAY: "Sábado",
		SUNDAY: "Domingo",
	},
}));
vi.mock("@/components/schedule/use-save-my-schedule", () => ({
	useSaveMySchedule: vi.fn(),
}));

import { toast } from "sonner";
import { ScheduleEditor } from "@/components/schedule/ScheduleEditor";
import { useSaveMySchedule } from "@/components/schedule/use-save-my-schedule";

const mockUseSaveMySchedule = vi.mocked(useSaveMySchedule);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseSaveMySchedule.mockReturnValue({
		mutateAsync: vi.fn(),
		isPending: false,
	} as never);
});

describe("ScheduleEditor", () => {
	it("renderiza uma linha para cada dia da semana com valores padrão", () => {
		render(<ScheduleEditor savedSchedule={[]} />);
		expect(screen.getByText("Segunda")).toBeInTheDocument();
		expect(screen.getByText("Domingo")).toBeInTheDocument();
		// dias de semana ativos por padrão, fim de semana inativo
		expect(screen.getAllByText("Ativo")).toHaveLength(5);
		expect(screen.getAllByText("Fechado")).toHaveLength(2);
	});

	it("usa os horários salvos quando savedSchedule é fornecido", () => {
		render(
			<ScheduleEditor
				savedSchedule={[
					{
						dayOfWeek: "MONDAY",
						startTime: "09:00",
						endTime: "17:00",
						consultationDurationMinutes: 40,
						breakBetweenConsultationsMinutes: 15,
						isActive: true,
					} as never,
				]}
			/>,
		);
		expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
		expect(screen.getByDisplayValue("17:00")).toBeInTheDocument();
	});

	it("atualiza o horário de início da segunda-feira ao alterar o input", () => {
		render(<ScheduleEditor savedSchedule={[]} />);
		const [mondayStartInput] = screen.getAllByDisplayValue("08:00");
		fireEvent.change(mondayStartInput, { target: { value: "10:00" } });
		expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();
	});

	it("alterna um dia de inativo para ativo ao clicar no switch", () => {
		render(<ScheduleEditor savedSchedule={[]} />);
		// sábado é o primeiro dia inativo por padrão
		const switches = screen.getAllByRole("switch");
		const saturdaySwitch = switches[5];
		fireEvent.click(saturdaySwitch);
		expect(screen.getAllByText("Ativo")).toHaveLength(6);
	});

	it("aplica a duração e o intervalo globais a todos os dias", () => {
		render(<ScheduleEditor savedSchedule={[]} />);
		fireEvent.change(screen.getByLabelText("Duração da consulta (min)"), {
			target: { value: "45" },
		});
		fireEvent.change(screen.getByLabelText("Intervalo entre consultas (min)"), {
			target: { value: "5" },
		});
		fireEvent.click(screen.getByText("Aplicar a todos os dias"));
		// não deve lançar erro e os inputs de horário continuam presentes
		expect(screen.getAllByDisplayValue("08:00").length).toBeGreaterThan(0);
	});

	it("chama saveSchedule e mostra toast de sucesso ao clicar em 'Salvar horários'", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseSaveMySchedule.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<ScheduleEditor savedSchedule={[]} />);
		await user.click(screen.getByText("Salvar horários"));
		expect(mutateAsync).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("Horários salvos com sucesso!");
	});

	it("mostra toast de erro quando saveSchedule falha", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockUseSaveMySchedule.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<ScheduleEditor savedSchedule={[]} />);
		await user.click(screen.getByText("Salvar horários"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar horários.");
	});

	it("desabilita o botão de salvar e mostra 'Salvando...' quando isPending é true", () => {
		mockUseSaveMySchedule.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		render(<ScheduleEditor savedSchedule={[]} />);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
		expect(screen.getByText("Salvando...").closest("button")).toBeDisabled();
	});
});
