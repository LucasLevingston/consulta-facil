import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/hooks/api/appointments/use-schedule-appointment", () => ({
	useScheduleAppointment: vi.fn(),
}));
vi.mock("@/hooks/api/appointments/use-cancel-appointment", () => ({
	useCancelAppointment: vi.fn(),
}));

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppointmentSubmit } from "@/features/appointments/hooks/use-appointment-submit";
import { useCancelAppointment } from "@/hooks/api/appointments/use-cancel-appointment";
import { useScheduleAppointment } from "@/hooks/api/appointments/use-schedule-appointment";

const mockUseRouter = vi.mocked(useRouter);
const mockUseScheduleAppointment = vi.mocked(useScheduleAppointment);
const mockUseCancelAppointment = vi.mocked(useCancelAppointment);

function makeForm() {
	return { reset: vi.fn() } as never;
}

const baseValues = {
	professionalId: "prof-1",
	scheduledAt: new Date("2026-08-10T09:00:00.000Z"),
	reason: "Consulta",
	notes: "Nenhuma",
	modality: "IN_PERSON" as const,
	cancellationReason: "",
};

let routerPush: ReturnType<typeof vi.fn>;
let scheduleMutateAsync: ReturnType<typeof vi.fn>;
let cancelMutateAsync: ReturnType<typeof vi.fn>;

const mockLocation = { href: "" };

beforeEach(() => {
	vi.clearAllMocks();
	mockLocation.href = "";
	Object.defineProperty(window, "location", {
		writable: true,
		value: mockLocation,
	});
	routerPush = vi.fn();
	mockUseRouter.mockReturnValue({ push: routerPush } as never);
	scheduleMutateAsync = vi.fn().mockResolvedValue({ id: "appt-1" });
	cancelMutateAsync = vi.fn().mockResolvedValue({});
	mockUseScheduleAppointment.mockReturnValue({
		mutateAsync: scheduleMutateAsync,
		isPending: false,
	} as never);
	mockUseCancelAppointment.mockReturnValue({
		mutateAsync: cancelMutateAsync,
		isPending: false,
	} as never);
});

describe("useAppointmentSubmit", () => {
	it("tipo create: agenda a consulta, reseta o form e redireciona para a página da consulta", async () => {
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "create",
				form,
				selectedProfessional: { id: "prof-1" } as never,
				selectedServiceId: "service-1",
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(scheduleMutateAsync).toHaveBeenCalledWith(
			expect.objectContaining({
				professionalId: "prof-1",
				serviceId: "service-1",
				scheduledAt: baseValues.scheduledAt.toISOString(),
			}),
		);
		expect(form.reset).toHaveBeenCalled();
		expect(routerPush).toHaveBeenCalledWith("/dashboard/appointments/appt-1");
	});

	it("tipo create: usa o professionalId do form quando não há profissional selecionado", async () => {
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "create",
				form,
				selectedProfessional: undefined,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(scheduleMutateAsync).toHaveBeenCalledWith(
			expect.objectContaining({
				professionalId: baseValues.professionalId,
				serviceId: undefined,
			}),
		);
	});

	it("tipo create: redireciona para checkoutUrl quando presente e não reseta o form nem navega", async () => {
		scheduleMutateAsync.mockResolvedValueOnce({
			id: "appt-1",
			checkoutUrl: "https://pay.example.com/checkout",
		});
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "create",
				form,
				selectedProfessional: { id: "prof-1" } as never,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(window.location.href).toBe("https://pay.example.com/checkout");
		expect(form.reset).not.toHaveBeenCalled();
		expect(routerPush).not.toHaveBeenCalled();
	});

	it("tipo schedule: agenda a consulta, fecha o modal e reseta o form sem navegar", async () => {
		const setOpen = vi.fn();
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "schedule",
				setOpen,
				form,
				selectedProfessional: { id: "prof-1" } as never,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(setOpen).toHaveBeenCalledWith(false);
		expect(form.reset).toHaveBeenCalled();
		expect(routerPush).not.toHaveBeenCalled();
	});

	it("tipo schedule: redireciona para checkoutUrl e não fecha o modal", async () => {
		scheduleMutateAsync.mockResolvedValueOnce({
			id: "appt-1",
			checkoutUrl: "https://pay.example.com/checkout",
		});
		const setOpen = vi.fn();
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "schedule",
				setOpen,
				form,
				selectedProfessional: { id: "prof-1" } as never,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(window.location.href).toBe("https://pay.example.com/checkout");
		expect(setOpen).not.toHaveBeenCalled();
	});

	it("tipo cancel: cancela a consulta usando a razão informada e fecha o modal", async () => {
		const setOpen = vi.fn();
		const form = makeForm();
		const appointment = {
			id: "appt-1",
			professionalId: "prof-1",
			patientId: "pat-1",
			scheduledAt: "2026-08-10T09:00:00.000Z",
			status: "SCHEDULED",
		} as never;
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "cancel",
				appointment,
				setOpen,
				form,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit({
				...baseValues,
				cancellationReason: "Imprevisto",
			} as never);
		});

		expect(cancelMutateAsync).toHaveBeenCalledWith({
			id: "appt-1",
			data: { cancellationReason: "Imprevisto" },
		});
		expect(setOpen).toHaveBeenCalledWith(false);
		expect(form.reset).toHaveBeenCalled();
	});

	it("tipo cancel: não faz nada quando não há appointment", async () => {
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "cancel",
				appointment: undefined,
				form,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(cancelMutateAsync).not.toHaveBeenCalled();
		expect(form.reset).not.toHaveBeenCalled();
	});

	it("mostra toast de erro com a mensagem da exceção quando o agendamento falha", async () => {
		scheduleMutateAsync.mockRejectedValueOnce(
			new Error("Horário indisponível"),
		);
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "create",
				form,
				selectedProfessional: { id: "prof-1" } as never,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(toast.error).toHaveBeenCalledWith("Horário indisponível");
	});

	it("mostra toast de erro com mensagem padrão quando a exceção não é um Error", async () => {
		scheduleMutateAsync.mockRejectedValueOnce("falha desconhecida");
		const form = makeForm();
		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "create",
				form,
				selectedProfessional: { id: "prof-1" } as never,
				selectedServiceId: null,
			}),
		);

		await act(async () => {
			await result.current.onSubmit(baseValues as never);
		});

		expect(toast.error).toHaveBeenCalledWith("Erro ao processar consulta.");
	});

	it("isPending reflete o estado das mutações de agendamento e cancelamento", async () => {
		mockUseScheduleAppointment.mockReturnValue({
			mutateAsync: scheduleMutateAsync,
			isPending: true,
		} as never);

		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "create",
				form: makeForm(),
				selectedProfessional: { id: "prof-1" } as never,
				selectedServiceId: null,
			}),
		);

		expect(result.current.isPending).toBe(true);
	});

	it("isPending é verdadeiro quando o cancelamento está em andamento", async () => {
		mockUseCancelAppointment.mockReturnValue({
			mutateAsync: cancelMutateAsync,
			isPending: true,
		} as never);

		const { result } = renderHook(() =>
			useAppointmentSubmit({
				type: "cancel",
				form: makeForm(),
				selectedServiceId: null,
			}),
		);

		expect(result.current.isPending).toBe(true);
	});
});
