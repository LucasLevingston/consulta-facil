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
	useSaveClinicWorkingHours: vi.fn(),
}));

import { toast } from "sonner";
import { ClinicHoursEditor } from "@/components/custom/clinic/ClinicHoursEditor";
import { useSaveClinicWorkingHours } from "@/features/schedule";

const mockUseSaveClinicWorkingHours = vi.mocked(useSaveClinicWorkingHours);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseSaveClinicWorkingHours.mockReturnValue({
		mutateAsync: vi.fn(),
		isPending: false,
	} as never);
});

describe("ClinicHoursEditor", () => {
	it("renderiza uma linha para cada dia da semana com valores padrão", () => {
		render(<ClinicHoursEditor clinicId="c-1" savedHours={[]} />);

		expect(screen.getByText("Segunda")).toBeInTheDocument();
		expect(screen.getByText("Domingo")).toBeInTheDocument();
		// dias de semana abertos por padrão, fins de semana fechados
		expect(screen.getAllByText("Aberto")).toHaveLength(5);
		expect(screen.getAllByText("Fechado")).toHaveLength(2);
	});

	it("usa os horários salvos quando savedHours é fornecido", () => {
		render(
			<ClinicHoursEditor
				clinicId="c-1"
				savedHours={[
					{
						dayOfWeek: "MONDAY",
						openTime: "09:00",
						closeTime: "17:00",
						isOpen: true,
					} as never,
				]}
			/>,
		);
		expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
		expect(screen.getByDisplayValue("17:00")).toBeInTheDocument();
	});

	it("chama saveHours e mostra toast de sucesso ao clicar em 'Salvar horários'", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseSaveClinicWorkingHours.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<ClinicHoursEditor clinicId="c-1" savedHours={[]} />);

		await user.click(screen.getByText("Salvar horários"));
		expect(mutateAsync).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("Horários salvos com sucesso!");
	});

	it("mostra toast de erro quando saveHours falha", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockUseSaveClinicWorkingHours.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<ClinicHoursEditor clinicId="c-1" savedHours={[]} />);

		await user.click(screen.getByText("Salvar horários"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar horários.");
	});

	it("desabilita o botão de salvar e mostra 'Salvando...' quando isPending é true", () => {
		mockUseSaveClinicWorkingHours.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		render(<ClinicHoursEditor clinicId="c-1" savedHours={[]} />);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
		expect(screen.getByText("Salvando...").closest("button")).toBeDisabled();
	});

	it("atualiza o horário de abertura da segunda-feira ao alterar o input", () => {
		render(<ClinicHoursEditor clinicId="c-1" savedHours={[]} />);

		// segunda-feira é a primeira linha renderizada
		const [mondayOpenInput] = screen.getAllByDisplayValue("08:00");
		fireEvent.change(mondayOpenInput, { target: { value: "10:00" } });
		expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();
	});
});
