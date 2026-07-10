import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/patients", () => ({
	updateMedicalRecordSchema: {},
}));
vi.mock("@/components/patients/hooks", () => ({
	useMedicalRecords: vi.fn(),
}));
vi.mock("./use-update-medical-records", () => ({
	useUpdateMedicalRecords: vi.fn(),
}));

import { toast } from "sonner";
import { useMedicalRecords } from "@/components/patients/hooks";
import { useMedicalHealthForm } from "./use-medical-health-form";
import { useUpdateMedicalRecords } from "./use-update-medical-records";

const mockUseMedicalRecords = vi.mocked(useMedicalRecords);
const mockUseUpdate = vi.mocked(useUpdateMedicalRecords);

function wrapper() {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockUseMedicalRecords.mockReturnValue({ data: undefined } as never);
	mockUseUpdate.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
});

describe("useMedicalHealthForm", () => {
	it("inicia com valores default quando não há registro médico", () => {
		const { result } = renderHook(() => useMedicalHealthForm("u-1"), {
			wrapper: wrapper(),
		});
		expect(result.current.form.getValues("bloodType")).toBeNull();
		expect(result.current.form.getValues("allergies")).toBe("");
		expect(result.current.bmi).toBeNull();
	});

	it("reseta o form com os dados do registro médico quando disponível", async () => {
		mockUseMedicalRecords.mockReturnValue({
			data: {
				bloodType: "O_POSITIVE",
				height: 1.8,
				weight: 80,
				allergies: "Poeira",
				currentMedication: "Nenhum",
				familyMedicalHistory: "Diabetes",
				pastMedicalHistory: "Nenhum",
			},
		} as never);
		const { result } = renderHook(() => useMedicalHealthForm("u-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() =>
			expect(result.current.form.getValues("allergies")).toBe("Poeira"),
		);
		expect(result.current.form.getValues("bloodType")).toBe("O_POSITIVE");
	});

	it("calcula o bmi a partir de altura e peso informados", async () => {
		mockUseMedicalRecords.mockReturnValue({
			data: {
				bloodType: null,
				height: 2,
				weight: 100,
				allergies: "",
				currentMedication: "",
				familyMedicalHistory: "",
				pastMedicalHistory: "",
			},
		} as never);
		const { result } = renderHook(() => useMedicalHealthForm("u-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.bmi).toBe(25));
	});

	it("expõe getBmiLabel e toNumber utilitários", () => {
		const { result } = renderHook(() => useMedicalHealthForm("u-1"), {
			wrapper: wrapper(),
		});
		expect(result.current.getBmiLabel(20)).toBe("Normal");
		expect(result.current.toNumber("42")).toBe(42);
	});

	it("onSubmit chama mutate e mostra toast de sucesso", () => {
		const mutate = vi.fn((_data, opts) => opts?.onSuccess?.());
		mockUseUpdate.mockReturnValue({ mutate, isPending: false } as never);
		const { result } = renderHook(() => useMedicalHealthForm("u-1"), {
			wrapper: wrapper(),
		});
		const data = {
			bloodType: "A_POSITIVE",
			height: 1.7,
			weight: 70,
			allergies: "",
			currentMedication: "",
			familyMedicalHistory: "",
			pastMedicalHistory: "",
		};
		act(() => {
			result.current.onSubmit(data as never);
		});
		expect(mutate).toHaveBeenCalledWith(data, expect.any(Object));
		expect(toast.success).toHaveBeenCalledWith("Dados de saúde atualizados!");
	});

	it("onSubmit mostra toast de erro quando a mutation falha", () => {
		const mutate = vi.fn((_data, opts) => opts?.onError?.());
		mockUseUpdate.mockReturnValue({ mutate, isPending: false } as never);
		const { result } = renderHook(() => useMedicalHealthForm("u-1"), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.onSubmit({
				bloodType: null,
				height: null,
				weight: null,
				allergies: "",
				currentMedication: "",
				familyMedicalHistory: "",
				pastMedicalHistory: "",
			} as never);
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar.");
	});

	it("isPending reflete o estado da mutation", () => {
		mockUseUpdate.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(() => useMedicalHealthForm("u-1"), {
			wrapper: wrapper(),
		});
		expect(result.current.isPending).toBe(true);
	});
});
