import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	// resolver funcional o suficiente para o handleSubmit do react-hook-form
	// aceitar os valores sem validar (usado apenas pelo useClinicForm)
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
vi.mock("@/components/dependents/use-create-dependent", () => ({
	useCreateDependent: vi.fn(),
}));
vi.mock("@/components/dependents/use-update-dependent", () => ({
	useUpdateDependent: vi.fn(),
}));

import { toast } from "sonner";
import { useCreateDependent } from "@/components/dependents/use-create-dependent";
import { useDependentForm } from "@/components/dependents/use-dependent-form";
import { useUpdateDependent } from "@/components/dependents/use-update-dependent";
import { useClinicForm } from "@/components/forms/use-clinic-form";
import { useCreateClinic } from "@/components/forms/use-create-clinic";
import { useUpdateClinic } from "@/components/forms/use-update-clinic";

const mockCreateClinic = vi.mocked(useCreateClinic);
const mockUpdateClinic = vi.mocked(useUpdateClinic);
const mockCreateDependent = vi.mocked(useCreateDependent);
const mockUpdateDependent = vi.mocked(useUpdateDependent);

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

describe("useDependentForm", () => {
	const onClose = vi.fn();
	const editing = {
		id: "d-1",
		name: "João",
		cpf: "111.111.111-11",
		birthDate: "2000-01-01",
		gender: "MALE",
		relationship: "CHILD",
	};

	beforeEach(() => {
		mockCreateDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
		mockUpdateDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
	});

	it("inicia com valores vazios quando não há dependente em edição", () => {
		const { result } = renderHook(
			() => useDependentForm({ editing: null, onClose }),
			{ wrapper: wrapper() },
		);
		expect(result.current.form.getValues("name")).toBe("");
		expect(result.current.form.getValues("cpf")).toBe("");
	});

	it("inicia com valores preenchidos quando há dependente em edição", () => {
		const { result } = renderHook(
			() => useDependentForm({ editing: editing as never, onClose }),
			{ wrapper: wrapper() },
		);
		expect(result.current.form.getValues("name")).toBe("João");
		expect(result.current.form.getValues("birthDate")).toBe("2000-01-01");
	});

	it("onSubmit chama useCreateDependent, reseta o form, fecha o diálogo e mostra toast de sucesso quando não é edição", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockCreateDependent.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const { result } = renderHook(
			() => useDependentForm({ editing: null, onClose }),
			{ wrapper: wrapper() },
		);
		const data = {
			name: "Maria",
			cpf: "222.222.222-22",
			birthDate: "1995-05-05",
			gender: "FEMALE",
			relationship: "SPOUSE",
		};
		await act(async () => {
			await result.current.onSubmit(data as never);
		});
		expect(mutateAsync).toHaveBeenCalledWith(data);
		expect(toast.success).toHaveBeenCalledWith("Dependente adicionado.");
		expect(onClose).toHaveBeenCalled();
	});

	it("onSubmit chama useUpdateDependent com id e mostra toast de sucesso quando é edição", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUpdateDependent.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const { result } = renderHook(
			() => useDependentForm({ editing: editing as never, onClose }),
			{ wrapper: wrapper() },
		);
		const data = { ...editing, name: "João Editado" };
		await act(async () => {
			await result.current.onSubmit(data as never);
		});
		expect(mutateAsync).toHaveBeenCalledWith({ id: "d-1", data });
		expect(toast.success).toHaveBeenCalledWith("Dependente atualizado.");
	});

	it("onSubmit mostra toast de erro quando a mutation falha", async () => {
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockCreateDependent.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const { result } = renderHook(
			() => useDependentForm({ editing: null, onClose }),
			{ wrapper: wrapper() },
		);
		await act(async () => {
			await result.current.onSubmit({
				name: "X",
				cpf: "1",
				birthDate: "2000-01-01",
				gender: "MALE",
				relationship: "CHILD",
			} as never);
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar dependente.");
		expect(onClose).not.toHaveBeenCalled();
	});

	it("isPending reflete create.isPending ou update.isPending", () => {
		mockCreateDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		mockUpdateDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
		const { result } = renderHook(
			() => useDependentForm({ editing: null, onClose }),
			{ wrapper: wrapper() },
		);
		expect(result.current.isPending).toBe(true);
	});
});
