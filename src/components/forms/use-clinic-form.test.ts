import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => (values: unknown) => ({ values, errors: {} })),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/clinics", () => ({
	createClinicSchema: {},
}));
vi.mock("@/components/forms/use-create-clinic", () => ({
	useCreateClinic: vi.fn(),
}));
vi.mock("@/components/forms/use-update-clinic", () => ({
	useUpdateClinic: vi.fn(),
}));

import { toast } from "sonner";
import { useCreateClinic } from "@/components/forms/use-create-clinic";
import { useUpdateClinic } from "@/components/forms/use-update-clinic";
import { useClinicForm } from "./use-clinic-form";

const mockCreateClinic = vi.mocked(useCreateClinic);
const mockUpdateClinic = vi.mocked(useUpdateClinic);

function wrapper() {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useClinicForm", () => {
	const clinic = {
		id: "c-1",
		name: "Clinica A",
		description: "desc",
		phone: "123",
		address: "Rua X",
		city: "SP",
		state: "SP",
		zipCode: "00000-000",
		latitude: -23.5,
		longitude: -46.6,
	};

	beforeEach(() => {
		mockCreateClinic.mockReturnValue({ mutateAsync: vi.fn() } as never);
		mockUpdateClinic.mockReturnValue({ mutateAsync: vi.fn() } as never);
	});

	it("inicia em modo criação com valores vazios quando não há clínica", () => {
		const { result } = renderHook(() => useClinicForm(), {
			wrapper: wrapper(),
		});
		expect(result.current.isEdit).toBe(false);
		expect(result.current.form.getValues("name")).toBe("");
		expect(result.current.lat).toBeNull();
		expect(result.current.lng).toBeNull();
	});

	it("inicia em modo edição com valores preenchidos quando há clínica", () => {
		const { result } = renderHook(() => useClinicForm(clinic as never), {
			wrapper: wrapper(),
		});
		expect(result.current.isEdit).toBe(true);
		expect(result.current.form.getValues("name")).toBe("Clinica A");
		expect(result.current.lat).toBe(-23.5);
		expect(result.current.lng).toBe(-46.6);
	});

	it("handleLocationSelect atualiza lat, lng e os campos latitude/longitude do form", () => {
		const { result } = renderHook(() => useClinicForm(), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.handleLocationSelect(-10, -20);
		});
		expect(result.current.lat).toBe(-10);
		expect(result.current.lng).toBe(-20);
		expect(result.current.form.getValues("latitude")).toBe(-10);
		expect(result.current.form.getValues("longitude")).toBe(-20);
	});

	it("onSubmit chama useCreateClinic e mostra toast de sucesso quando não é edição", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockCreateClinic.mockReturnValue({ mutateAsync } as never);
		const { result } = renderHook(() => useClinicForm(), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.form.setValue("name", "Nova clinica");
		});
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(mutateAsync).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("Clínica criada com sucesso!");
	});

	it("onSubmit chama useUpdateClinic com id e mostra toast de sucesso quando é edição", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUpdateClinic.mockReturnValue({ mutateAsync } as never);
		const { result } = renderHook(() => useClinicForm(clinic as never), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(mutateAsync).toHaveBeenCalledWith(
			expect.objectContaining({ id: "c-1" }),
		);
		expect(toast.success).toHaveBeenCalledWith(
			"Clínica atualizada com sucesso!",
		);
	});

	it("onSubmit mostra toast de erro quando a mutation falha", async () => {
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockCreateClinic.mockReturnValue({ mutateAsync } as never);
		const { result } = renderHook(() => useClinicForm(), {
			wrapper: wrapper(),
		});
		act(() => {
			result.current.form.setValue("name", "Nome");
		});
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar clínica.");
	});
});
