import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/api/professionals/use-professionals", () => ({
	useProfessionals: vi.fn(),
}));
vi.mock("@/hooks/api/schedule/use-professional-schedule", () => ({
	useProfessionalSchedule: vi.fn(),
}));
vi.mock("@/hooks/api/services/use-get-professional-services", () => ({
	useGetProfessionalServices: vi.fn(),
}));

import { useAppointmentProfessionalData } from "@/features/appointments/hooks/use-appointment-professional-data";
import { useProfessionals } from "@/hooks/api/professionals/use-professionals";
import { useProfessionalSchedule } from "@/hooks/api/schedule/use-professional-schedule";
import { useGetProfessionalServices } from "@/hooks/api/services/use-get-professional-services";

const mockUseProfessionals = vi.mocked(useProfessionals);
const mockUseProfessionalSchedule = vi.mocked(useProfessionalSchedule);
const mockUseGetProfessionalServices = vi.mocked(useGetProfessionalServices);

const professionalA = { id: "prof-1", userId: "user-1", name: "Dra. Ana" };
const professionalB = { id: "prof-2", userId: "user-2", name: "Dr. Bruno" };

beforeEach(() => {
	vi.clearAllMocks();
	mockUseProfessionals.mockReturnValue({
		data: { content: [professionalA, professionalB] },
		isLoading: false,
	} as never);
	mockUseProfessionalSchedule.mockReturnValue({
		data: [],
		isLoading: false,
	} as never);
	mockUseGetProfessionalServices.mockReturnValue({ data: [] } as never);
});

describe("useAppointmentProfessionalData", () => {
	it("retorna a lista de profissionais a partir da página retornada pela query", () => {
		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "",
				selectedServiceId: null,
			}),
		);

		expect(result.current.professionals).toEqual([
			professionalA,
			professionalB,
		]);
	});

	it("retorna lista vazia quando a query de profissionais não tem dados ainda", () => {
		mockUseProfessionals.mockReturnValue({
			data: undefined,
			isLoading: true,
		} as never);

		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "",
				selectedServiceId: null,
			}),
		);

		expect(result.current.professionals).toEqual([]);
		expect(result.current.professionalsLoading).toBe(true);
	});

	it("encontra o profissional selecionado pelo id", () => {
		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "prof-2",
				selectedServiceId: null,
			}),
		);

		expect(result.current.selectedProfessional).toEqual(professionalB);
	});

	it("encontra o profissional selecionado pelo userId como fallback", () => {
		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "user-1",
				selectedServiceId: null,
			}),
		);

		expect(result.current.selectedProfessional).toEqual(professionalA);
	});

	it("retorna selectedProfessional indefinido quando nenhum id corresponde", () => {
		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "inexistente",
				selectedServiceId: null,
			}),
		);

		expect(result.current.selectedProfessional).toBeUndefined();
	});

	it("busca a agenda usando o id do profissional selecionado", () => {
		renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "prof-2",
				selectedServiceId: null,
			}),
		);

		expect(mockUseProfessionalSchedule).toHaveBeenCalledWith("prof-2");
	});

	it("busca a agenda com string vazia quando não há profissional selecionado", () => {
		renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "inexistente",
				selectedServiceId: null,
			}),
		);

		expect(mockUseProfessionalSchedule).toHaveBeenCalledWith("");
	});

	it("propaga o estado de carregamento da agenda", () => {
		mockUseProfessionalSchedule.mockReturnValue({
			data: [],
			isLoading: true,
		} as never);

		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "prof-1",
				selectedServiceId: null,
			}),
		);

		expect(result.current.scheduleLoading).toBe(true);
	});

	it("encontra o serviço selecionado dentre os serviços do profissional", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [
				{ id: "svc-1", durationMinutes: 30 },
				{ id: "svc-2", durationMinutes: 60 },
			],
		} as never);

		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "prof-1",
				selectedServiceId: "svc-2",
			}),
		);

		expect(result.current.selectedService).toEqual({
			id: "svc-2",
			durationMinutes: 60,
		});
	});

	it("retorna selectedService indefinido quando selectedServiceId é nulo", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [{ id: "svc-1", durationMinutes: 30 }],
		} as never);

		const { result } = renderHook(() =>
			useAppointmentProfessionalData({
				selectedProfessionalId: "prof-1",
				selectedServiceId: null,
			}),
		);

		expect(result.current.selectedService).toBeUndefined();
	});
});
