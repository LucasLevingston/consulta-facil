import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useSearchParams: vi.fn(),
}));
vi.mock("@/store/useUserStore", () => ({
	useUserStore: vi.fn(),
}));
vi.mock("@/hooks/use-appointment-form-state", () => ({
	useAppointmentFormState: vi.fn(),
}));
vi.mock("@/hooks/use-appointment-professional-data", () => ({
	useAppointmentProfessionalData: vi.fn(),
}));
vi.mock("@/hooks/use-appointment-slots", () => ({
	useAppointmentSlots: vi.fn(),
}));
vi.mock("@/hooks/use-appointment-submit", () => ({
	useAppointmentSubmit: vi.fn(),
}));

import { useSearchParams } from "next/navigation";
import { useAppointmentFormSetup } from "@/hooks/use-appointment-form-setup";
import { useAppointmentFormState } from "@/hooks/use-appointment-form-state";
import { useAppointmentProfessionalData } from "@/hooks/use-appointment-professional-data";
import { useAppointmentSlots } from "@/hooks/use-appointment-slots";
import { useAppointmentSubmit } from "@/hooks/use-appointment-submit";
import { useUserStore } from "@/store/useUserStore";

const mockUseSearchParams = vi.mocked(useSearchParams);
const mockUseUserStore = vi.mocked(useUserStore);
const mockUseAppointmentFormState = vi.mocked(useAppointmentFormState);
const mockUseAppointmentProfessionalData = vi.mocked(
	useAppointmentProfessionalData,
);
const mockUseAppointmentSlots = vi.mocked(useAppointmentSlots);
const mockUseAppointmentSubmit = vi.mocked(useAppointmentSubmit);

function makeForm(overrides: Record<string, unknown> = {}) {
	const values: Record<string, unknown> = {
		professionalId: "prof-1",
		scheduledAt: undefined,
		...overrides,
	};
	return {
		watch: vi.fn((field: string) => values[field]),
		setValue: vi.fn(),
		reset: vi.fn(),
	} as never;
}

beforeEach(() => {
	vi.clearAllMocks();
	mockUseSearchParams.mockReturnValue({
		get: vi.fn(() => null),
	} as never);
	mockUseUserStore.mockReturnValue({ user: { id: "user-1" } } as never);
	mockUseAppointmentFormState.mockReturnValue({
		form: makeForm(),
		selectedTime: "",
		setSelectedTime: vi.fn(),
		selectedServiceId: null,
		setSelectedServiceId: vi.fn(),
	} as never);
	mockUseAppointmentProfessionalData.mockReturnValue({
		professionals: [],
		professionalsLoading: false,
		selectedProfessional: undefined,
		scheduleList: [],
		scheduleLoading: false,
		selectedService: undefined,
	} as never);
	mockUseAppointmentSlots.mockReturnValue({
		bookedTimesForDate: new Set(),
		availableSlots: [],
		isQueueMode: false,
		isDayDisabled: vi.fn(() => false),
		handleTimeSelect: vi.fn(),
	} as never);
	mockUseAppointmentSubmit.mockReturnValue({
		onSubmit: vi.fn(),
		isPending: false,
	} as never);
});

describe("useAppointmentFormSetup", () => {
	it("compõe o retorno de todos os sub-hooks do fluxo de agendamento", () => {
		const { result } = renderHook(() =>
			useAppointmentFormSetup({ type: "create" }),
		);

		expect(result.current.form).toBeDefined();
		expect(result.current.professionals).toEqual([]);
		expect(result.current.availableSlots).toEqual([]);
		expect(typeof result.current.onSubmit).toBe("function");
		expect(result.current.isPending).toBe(false);
	});

	it("lê professionalId da query string 'professionalid'", () => {
		mockUseSearchParams.mockReturnValue({
			get: vi.fn((key: string) =>
				key === "professionalid" ? "prof-from-url" : null,
			),
		} as never);

		const { result } = renderHook(() =>
			useAppointmentFormSetup({ type: "create" }),
		);

		expect(result.current.professionalIdParam).toBe("prof-from-url");
		expect(mockUseAppointmentFormState).toHaveBeenCalledWith(
			expect.objectContaining({ professionalIdParam: "prof-from-url" }),
		);
	});

	it("cai para o parâmetro legado 'doctorid' quando 'professionalid' está ausente", () => {
		mockUseSearchParams.mockReturnValue({
			get: vi.fn((key: string) =>
				key === "doctorid" ? "doctor-legacy" : null,
			),
		} as never);

		const { result } = renderHook(() =>
			useAppointmentFormSetup({ type: "create" }),
		);

		expect(result.current.professionalIdParam).toBe("doctor-legacy");
	});

	it("usa string vazia como userId quando não há usuário autenticado", () => {
		mockUseUserStore.mockReturnValue({ user: null } as never);

		renderHook(() => useAppointmentFormSetup({ type: "create" }));

		expect(mockUseAppointmentFormState).toHaveBeenCalledWith(
			expect.objectContaining({ userId: "" }),
		);
	});

	it("repassa o professionalId selecionado do form para useAppointmentProfessionalData", () => {
		mockUseAppointmentFormState.mockReturnValue({
			form: makeForm({ professionalId: "prof-selected" }),
			selectedTime: "",
			setSelectedTime: vi.fn(),
			selectedServiceId: "service-1",
			setSelectedServiceId: vi.fn(),
		} as never);

		renderHook(() => useAppointmentFormSetup({ type: "create" }));

		expect(mockUseAppointmentProfessionalData).toHaveBeenCalledWith(
			expect.objectContaining({
				selectedProfessionalId: "prof-selected",
				selectedServiceId: "service-1",
			}),
		);
	});

	it("usa o id do profissional selecionado (não o do form) para buscar os horários", () => {
		mockUseAppointmentProfessionalData.mockReturnValue({
			professionals: [],
			professionalsLoading: false,
			selectedProfessional: { id: "prof-resolved" },
			scheduleList: [],
			scheduleLoading: false,
			selectedService: undefined,
		} as never);

		renderHook(() => useAppointmentFormSetup({ type: "create" }));

		expect(mockUseAppointmentSlots).toHaveBeenCalledWith(
			expect.objectContaining({ professionalId: "prof-resolved" }),
		);
	});

	it("expõe isPending vindo do useAppointmentSubmit", () => {
		mockUseAppointmentSubmit.mockReturnValue({
			onSubmit: vi.fn(),
			isPending: true,
		} as never);

		const { result } = renderHook(() =>
			useAppointmentFormSetup({ type: "schedule" }),
		);

		expect(result.current.isPending).toBe(true);
	});
});
