import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { DatePickerField } from "@/components/forms/Appointments/steps/DatePickerField";
import { DateTimeStep } from "@/components/forms/Appointments/steps/DateTimeStep";
import { TimeSlotPicker } from "@/components/forms/Appointments/steps/TimeSlotPicker";
import type { UseAppointmentFormSetupReturn } from "@/hooks/use-appointment-form-setup";
import type { TimeSlot } from "@/lib/types/time-slot";

describe("TimeSlotPicker", () => {
	const slots: TimeSlot[] = [
		{ label: "09:00", hours: 9, minutes: 0 },
		{ label: "09:30", hours: 9, minutes: 30 },
	];

	it("mostra mensagem para selecionar um profissional quando nenhum está selecionado", () => {
		render(
			<TimeSlotPicker
				selectedProfessional={undefined}
				scheduleLoading={false}
				availableSlots={[]}
				bookedTimesForDate={new Set()}
				selectedDate={undefined}
				selectedTime=""
				onTimeSelect={vi.fn()}
			/>,
		);

		expect(
			screen.getByText(
				"Selecione um profissional para ver os horários disponíveis.",
			),
		).toBeInTheDocument();
	});

	it("mostra 'Carregando horários...' quando scheduleLoading é true", () => {
		render(
			<TimeSlotPicker
				selectedProfessional={{ id: "prof-1" } as never}
				scheduleLoading={true}
				availableSlots={[]}
				bookedTimesForDate={new Set()}
				selectedDate={undefined}
				selectedTime=""
				onTimeSelect={vi.fn()}
			/>,
		);

		expect(screen.getByText("Carregando horários...")).toBeInTheDocument();
	});

	it("mostra mensagem para selecionar uma data quando não há data selecionada", () => {
		render(
			<TimeSlotPicker
				selectedProfessional={{ id: "prof-1" } as never}
				scheduleLoading={false}
				availableSlots={[]}
				bookedTimesForDate={new Set()}
				selectedDate={undefined}
				selectedTime=""
				onTimeSelect={vi.fn()}
			/>,
		);

		expect(
			screen.getByText("Selecione uma data para ver os horários."),
		).toBeInTheDocument();
	});

	it("mostra mensagem de que o profissional não atende no dia quando não há slots disponíveis", () => {
		render(
			<TimeSlotPicker
				selectedProfessional={{ id: "prof-1" } as never}
				scheduleLoading={false}
				availableSlots={[]}
				bookedTimesForDate={new Set()}
				selectedDate={new Date(2026, 7, 10)}
				selectedTime=""
				onTimeSelect={vi.fn()}
			/>,
		);

		expect(
			screen.getByText("Profissional não atende neste dia."),
		).toBeInTheDocument();
	});

	it("renderiza os horários disponíveis e desabilita os já reservados", () => {
		render(
			<TimeSlotPicker
				selectedProfessional={{ id: "prof-1" } as never}
				scheduleLoading={false}
				availableSlots={slots}
				bookedTimesForDate={new Set(["09:30"])}
				selectedDate={new Date(2026, 7, 10)}
				selectedTime=""
				onTimeSelect={vi.fn()}
			/>,
		);

		expect(screen.getByText("09:00")).not.toBeDisabled();
		expect(screen.getByText("09:30").closest("button")).toBeDisabled();
	});

	it("chama onTimeSelect ao clicar em um horário disponível", async () => {
		const user = userEvent.setup();
		const onTimeSelect = vi.fn();
		render(
			<TimeSlotPicker
				selectedProfessional={{ id: "prof-1" } as never}
				scheduleLoading={false}
				availableSlots={slots}
				bookedTimesForDate={new Set()}
				selectedDate={new Date(2026, 7, 10)}
				selectedTime=""
				onTimeSelect={onTimeSelect}
			/>,
		);

		await user.click(screen.getByText("09:00"));

		expect(onTimeSelect).toHaveBeenCalledWith(slots[0]);
	});

	it("não chama onTimeSelect ao clicar em um horário reservado", async () => {
		const user = userEvent.setup();
		const onTimeSelect = vi.fn();
		render(
			<TimeSlotPicker
				selectedProfessional={{ id: "prof-1" } as never}
				scheduleLoading={false}
				availableSlots={slots}
				bookedTimesForDate={new Set(["09:30"])}
				selectedDate={new Date(2026, 7, 10)}
				selectedTime=""
				onTimeSelect={onTimeSelect}
			/>,
		);

		await user.click(screen.getByText("09:30"));

		expect(onTimeSelect).not.toHaveBeenCalled();
	});

	it("mostra o resumo com data e horário quando ambos estão selecionados", () => {
		render(
			<TimeSlotPicker
				selectedProfessional={{ id: "prof-1" } as never}
				scheduleLoading={false}
				availableSlots={slots}
				bookedTimesForDate={new Set()}
				selectedDate={new Date(2026, 7, 10)}
				selectedTime="09:00"
				onTimeSelect={vi.fn()}
			/>,
		);

		expect(screen.getByText(/às 09:00/)).toBeInTheDocument();
	});
});

describe("DatePickerField", () => {
	function Wrapper({
		isQueueMode = false,
		isDayDisabled = () => false,
		onDateChange = vi.fn(),
		defaultDate,
	}: {
		isQueueMode?: boolean;
		isDayDisabled?: (date: Date) => boolean;
		onDateChange?: () => void;
		defaultDate?: Date;
	}) {
		const form = useForm<{ scheduledAt: Date | undefined }>({
			defaultValues: { scheduledAt: defaultDate },
		});

		return (
			<FormProvider {...form}>
				<DatePickerField
					control={form.control as never}
					isQueueMode={isQueueMode}
					isDayDisabled={isDayDisabled}
					onDateChange={onDateChange}
				/>
				<span data-testid="scheduled-at">
					{form.watch("scheduledAt")?.toISOString() ?? ""}
				</span>
			</FormProvider>
		);
	}

	it("mostra 'Selecione uma data' quando nenhuma data está selecionada", () => {
		render(<Wrapper />);

		expect(screen.getByText("Selecione uma data")).toBeInTheDocument();
	});

	it("mostra a data formatada quando já existe uma data selecionada", () => {
		render(<Wrapper defaultDate={new Date(2026, 7, 10)} />);

		expect(
			screen.getByText("segunda-feira, 10 de agosto de 2026"),
		).toBeInTheDocument();
	});

	it("seleciona uma data no calendário e chama onDateChange", async () => {
		const user = userEvent.setup();
		const onDateChange = vi.fn();
		render(<Wrapper onDateChange={onDateChange} />);

		await user.click(
			screen.getByRole("button", { name: /Selecione uma data/ }),
		);

		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		expect(dayButtons.length).toBeGreaterThan(0);

		await user.click(dayButtons[0]);

		expect(onDateChange).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId("scheduled-at").textContent).not.toBe("");
	});

	it("desabilita todos os dias quando isDayDisabled sempre retorna true", async () => {
		const user = userEvent.setup();
		render(<Wrapper isDayDisabled={() => true} />);

		await user.click(
			screen.getByRole("button", { name: /Selecione uma data/ }),
		);

		const enabledDayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);

		expect(enabledDayButtons).toHaveLength(0);
	});

	it("em modo fila, ajusta a data selecionada para as 09:00", async () => {
		const user = userEvent.setup();
		render(<Wrapper isQueueMode={true} />);

		await user.click(
			screen.getByRole("button", { name: /Selecione uma data/ }),
		);
		const dayButtons = screen
			.getAllByRole("gridcell")
			.map((cell) => cell.querySelector("button"))
			.filter((btn): btn is HTMLButtonElement => !!btn && !btn.disabled);
		await user.click(dayButtons[0]);

		const isoValue = screen.getByTestId("scheduled-at").textContent ?? "";
		expect(isoValue).not.toBe("");
		const selected = new Date(isoValue);
		expect(selected.getHours()).toBe(9);
		expect(selected.getMinutes()).toBe(0);
	});
});

describe("DateTimeStep", () => {
	function Wrapper({
		hookOverrides = {},
	}: {
		hookOverrides?: Record<string, unknown>;
	}) {
		const form = useForm<{ scheduledAt: Date | undefined }>({
			defaultValues: { scheduledAt: undefined },
		});

		const hook = {
			form,
			selectedProfessional: undefined,
			scheduleLoading: false,
			availableSlots: [],
			bookedTimesForDate: new Set(),
			isQueueMode: false,
			isDayDisabled: () => false,
			selectedDate: undefined,
			selectedTime: "",
			handleTimeSelect: vi.fn(),
			setSelectedTime: vi.fn(),
			...hookOverrides,
		} as unknown as UseAppointmentFormSetupReturn;

		return (
			<FormProvider {...form}>
				<DateTimeStep hook={hook} />
			</FormProvider>
		);
	}

	it("renderiza o título 'Data e horário'", () => {
		render(<Wrapper />);

		expect(screen.getByText("Data e horário")).toBeInTheDocument();
	});

	it("renderiza o DatePickerField e o TimeSlotPicker quando não é modo fila", () => {
		render(<Wrapper hookOverrides={{ isQueueMode: false }} />);

		expect(screen.getByText("Selecione uma data")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Selecione um profissional para ver os horários disponíveis.",
			),
		).toBeInTheDocument();
	});

	it("renderiza o alerta de fila e oculta o TimeSlotPicker quando isQueueMode é true", () => {
		render(<Wrapper hookOverrides={{ isQueueMode: true }} />);

		expect(
			screen.getByText(/Este profissional usa sistema de fila/),
		).toBeInTheDocument();
		expect(
			screen.queryByText(
				"Selecione um profissional para ver os horários disponíveis.",
			),
		).not.toBeInTheDocument();
	});

	it("mostra a confirmação de entrada na fila quando há uma data selecionada em modo fila", () => {
		render(
			<Wrapper
				hookOverrides={{
					isQueueMode: true,
					selectedDate: new Date(2026, 7, 10),
				}}
			/>,
		);

		expect(screen.getByText(/entrada na fila/)).toBeInTheDocument();
	});

	it("não mostra a confirmação de fila quando ainda não há data selecionada", () => {
		render(
			<Wrapper
				hookOverrides={{ isQueueMode: true, selectedDate: undefined }}
			/>,
		);

		expect(screen.queryByText(/entrada na fila/)).not.toBeInTheDocument();
	});
});
