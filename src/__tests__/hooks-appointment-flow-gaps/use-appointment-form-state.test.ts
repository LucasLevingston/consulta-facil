import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));

import { useAppointmentFormState } from "@/hooks/use-appointment-form-state";

describe("useAppointmentFormState", () => {
	it("inicializa com valores padrão quando não há appointment nem parâmetros", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: null,
				serviceIdParam: null,
				userId: "user-1",
			}),
		);

		expect(result.current.form.getValues("professionalId")).toBe("");
		expect(result.current.form.getValues("reason")).toBe("");
		expect(result.current.form.getValues("notes")).toBe("");
		expect(result.current.form.getValues("cancellationReason")).toBe("");
		expect(result.current.form.getValues("userId")).toBe("user-1");
		expect(result.current.form.getValues("modality")).toBe("IN_PERSON");
		expect(result.current.form.getValues("scheduledAt")).toBeUndefined();
		expect(result.current.selectedServiceId).toBeNull();
		expect(result.current.selectedTime).toBe("");
	});

	it("usa professionalIdParam como professionalId quando não há appointment", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: "prof-123",
				serviceIdParam: null,
				userId: "user-1",
			}),
		);

		expect(result.current.form.getValues("professionalId")).toBe("prof-123");
	});

	it("prioriza dados do appointment sobre os parâmetros da URL", () => {
		const appointment = {
			id: "appt-1",
			patientId: "patient-1",
			professionalId: "prof-from-appointment",
			scheduledAt: "2026-08-10T14:30:00.000Z",
			reason: "Consulta de rotina",
			notes: "Trazer exames",
			modality: "ONLINE" as const,
			status: "SCHEDULED" as const,
		};

		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: appointment as never,
				professionalIdParam: "prof-from-param",
				serviceIdParam: null,
				userId: "user-1",
			}),
		);

		expect(result.current.form.getValues("professionalId")).toBe(
			"prof-from-appointment",
		);
		expect(result.current.form.getValues("reason")).toBe("Consulta de rotina");
		expect(result.current.form.getValues("notes")).toBe("Trazer exames");
		expect(result.current.form.getValues("modality")).toBe("ONLINE");
		expect(result.current.form.getValues("scheduledAt")).toBeInstanceOf(Date);
	});

	it("inicializa selectedServiceId a partir de serviceIdParam", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: null,
				serviceIdParam: "service-9",
				userId: "user-1",
			}),
		);

		expect(result.current.selectedServiceId).toBe("service-9");
	});

	it("atualiza selectedTime via setSelectedTime", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: null,
				serviceIdParam: null,
				userId: "user-1",
			}),
		);

		act(() => {
			result.current.setSelectedTime("10:30");
		});

		expect(result.current.selectedTime).toBe("10:30");
	});

	it("atualiza selectedServiceId via setSelectedServiceId", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: null,
				serviceIdParam: null,
				userId: "user-1",
			}),
		);

		act(() => {
			result.current.setSelectedServiceId("service-42");
		});

		expect(result.current.selectedServiceId).toBe("service-42");
	});

	it("aplica reason e modality do voicePreset ao formulário", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: null,
				serviceIdParam: null,
				userId: "user-1",
				voicePreset: {
					specialty: null,
					professionalName: null,
					date: null,
					timePreference: null,
					modality: "ONLINE",
					reason: "Dor de cabeça",
					confidence: "high",
					summary: "resumo",
				},
			}),
		);

		expect(result.current.form.getValues("reason")).toBe("Dor de cabeça");
		expect(result.current.form.getValues("modality")).toBe("ONLINE");
	});

	it("aplica data válida do voicePreset ao scheduledAt", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: null,
				serviceIdParam: null,
				userId: "user-1",
				voicePreset: {
					specialty: null,
					professionalName: null,
					date: "2026-09-01",
					timePreference: null,
					modality: null,
					reason: null,
					confidence: "medium",
					summary: "resumo",
				},
			}),
		);

		const scheduledAt = result.current.form.getValues("scheduledAt");
		expect(scheduledAt).toBeInstanceOf(Date);
		expect((scheduledAt as Date).getFullYear()).toBe(2026);
		expect((scheduledAt as Date).getMonth()).toBe(8);
		expect((scheduledAt as Date).getDate()).toBe(1);
	});

	it("ignora voicePreset ausente sem quebrar o formulário", () => {
		const { result } = renderHook(() =>
			useAppointmentFormState({
				appointment: undefined,
				professionalIdParam: null,
				serviceIdParam: null,
				userId: "user-1",
				voicePreset: null,
			}),
		);

		expect(result.current.form.getValues("reason")).toBe("");
	});
});
