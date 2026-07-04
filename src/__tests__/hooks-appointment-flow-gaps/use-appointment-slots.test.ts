import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/api/appointments/use-professional-appointments", () => ({
	useProfessionalAppointments: vi.fn(),
}));

import { useProfessionalAppointments } from "@/hooks/api/appointments/use-professional-appointments";
import { useAppointmentSlots } from "@/hooks/use-appointment-slots";

const mockUseProfessionalAppointments = vi.mocked(useProfessionalAppointments);

function makeForm() {
	return { setValue: vi.fn() } as never;
}

// Segunda-feira fixa e no futuro para os testes de disponibilidade.
const MONDAY = new Date(2026, 7, 10); // 10/08/2026 é uma segunda-feira

const activeMondaySchedule = {
	id: "sched-1",
	professionalProfileId: "prof-1",
	dayOfWeek: "MONDAY" as const,
	startTime: "08:00",
	endTime: "10:00",
	consultationDurationMinutes: 30,
	breakBetweenConsultationsMinutes: 0,
	isActive: true,
};

beforeEach(() => {
	vi.clearAllMocks();
	mockUseProfessionalAppointments.mockReturnValue({ data: undefined } as never);
});

describe("useAppointmentSlots", () => {
	it("retorna bookedTimesForDate vazio quando não há data selecionada", () => {
		mockUseProfessionalAppointments.mockReturnValue({
			data: {
				content: [{ status: "SCHEDULED", scheduledAt: MONDAY.toISOString() }],
			},
		} as never);

		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: undefined,
				selectedService: undefined,
				scheduleList: [],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.bookedTimesForDate.size).toBe(0);
	});

	it("calcula bookedTimesForDate a partir dos agendamentos não cancelados do dia", () => {
		const bookedDate = new Date(MONDAY);
		bookedDate.setHours(9, 0, 0, 0);
		const canceledDate = new Date(MONDAY);
		canceledDate.setHours(9, 30, 0, 0);

		mockUseProfessionalAppointments.mockReturnValue({
			data: {
				content: [
					{ status: "SCHEDULED", scheduledAt: bookedDate.toISOString() },
					{ status: "CANCELED", scheduledAt: canceledDate.toISOString() },
				],
			},
		} as never);

		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.bookedTimesForDate.has("09:00")).toBe(true);
		expect(result.current.bookedTimesForDate.has("09:30")).toBe(false);
	});

	it("retorna availableSlots vazio quando não há data selecionada", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: undefined,
				selectedService: undefined,
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.availableSlots).toEqual([]);
	});

	it("retorna availableSlots vazio quando a agenda não tem horário ativo para o dia", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [{ ...activeMondaySchedule, dayOfWeek: "TUESDAY" }],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.availableSlots).toEqual([]);
	});

	it("calcula os slots disponíveis usando a duração da agenda quando não há serviço selecionado", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.availableSlots).toEqual([
			{ label: "08:00", hours: 8, minutes: 0 },
			{ label: "08:30", hours: 8, minutes: 30 },
			{ label: "09:00", hours: 9, minutes: 0 },
			{ label: "09:30", hours: 9, minutes: 30 },
		]);
	});

	it("usa a duração do serviço selecionado para calcular os slots", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: { durationMinutes: 60 },
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.availableSlots).toEqual([
			{ label: "08:00", hours: 8, minutes: 0 },
			{ label: "09:00", hours: 9, minutes: 0 },
		]);
	});

	it("isQueueMode é verdadeiro quando há profissional, agenda carregada e sem horários cadastrados", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.isQueueMode).toBe(true);
	});

	it("isQueueMode é falso enquanto a agenda ainda está carregando", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [],
				scheduleLoading: true,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.isQueueMode).toBe(false);
	});

	it("isQueueMode é falso quando existem horários cadastrados", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.isQueueMode).toBe(false);
	});

	it("isDayDisabled retorna true para datas passadas", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		const pastDate = new Date(2020, 0, 1);
		expect(result.current.isDayDisabled(pastDate)).toBe(true);
	});

	it("isDayDisabled retorna false quando não há agenda cadastrada (modo fila)", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		expect(result.current.isDayDisabled(MONDAY)).toBe(false);
	});

	it("isDayDisabled retorna true para dias sem horário ativo na agenda", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		// Terça-feira não está na agenda ativa (apenas segunda está).
		const tuesday = new Date(2026, 7, 11);
		expect(result.current.isDayDisabled(tuesday)).toBe(true);
	});

	it("isDayDisabled retorna false para dias com horário ativo na agenda", () => {
		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form: makeForm(),
				setSelectedTime: vi.fn(),
			}),
		);

		const nextMonday = new Date(2026, 7, 17);
		expect(result.current.isDayDisabled(nextMonday)).toBe(false);
	});

	it("handleTimeSelect atualiza o horário selecionado e o valor do form com base na data selecionada", () => {
		const setSelectedTime = vi.fn();
		const form = makeForm();

		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: MONDAY,
				selectedService: undefined,
				scheduleList: [activeMondaySchedule],
				scheduleLoading: false,
				form,
				setSelectedTime,
			}),
		);

		result.current.handleTimeSelect({ label: "09:00", hours: 9, minutes: 0 });

		expect(setSelectedTime).toHaveBeenCalledWith("09:00");
		expect(form.setValue).toHaveBeenCalledWith("scheduledAt", expect.any(Date));
		const settledDate = (form.setValue as ReturnType<typeof vi.fn>).mock
			.calls[0][1] as Date;
		expect(settledDate.getHours()).toBe(9);
		expect(settledDate.getMinutes()).toBe(0);
		expect(settledDate.getDate()).toBe(MONDAY.getDate());
	});

	it("handleTimeSelect usa a data atual como base quando não há data selecionada", () => {
		const setSelectedTime = vi.fn();
		const form = makeForm();

		const { result } = renderHook(() =>
			useAppointmentSlots({
				professionalId: "prof-1",
				selectedDate: undefined,
				selectedService: undefined,
				scheduleList: [],
				scheduleLoading: false,
				form,
				setSelectedTime,
			}),
		);

		result.current.handleTimeSelect({ label: "14:15", hours: 14, minutes: 15 });

		const settledDate = (form.setValue as ReturnType<typeof vi.fn>).mock
			.calls[0][1] as Date;
		expect(settledDate.getHours()).toBe(14);
		expect(settledDate.getMinutes()).toBe(15);
	});
});
