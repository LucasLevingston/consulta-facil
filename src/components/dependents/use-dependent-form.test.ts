import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/components/dependents/use-create-dependent", () => ({
	useCreateDependent: vi.fn(),
}));
vi.mock("@/components/dependents/use-update-dependent", () => ({
	useUpdateDependent: vi.fn(),
}));

import { toast } from "sonner";
import { useCreateDependent } from "@/components/dependents/use-create-dependent";
import { useUpdateDependent } from "@/components/dependents/use-update-dependent";
import { useDependentForm } from "./use-dependent-form";

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
