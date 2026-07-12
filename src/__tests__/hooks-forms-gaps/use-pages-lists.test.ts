import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/components/dependents/hooks", () => ({
	useDeleteDependent: vi.fn(),
}));

import { toast } from "sonner";
import { useDependentsPage } from "@/app/dashboard/dependents/use-dependents-page";
import { useDeleteDependent } from "@/components/dependents/hooks";

const mockUseDeleteDependent = vi.mocked(useDeleteDependent);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useDependentsPage", () => {
	beforeEach(() => {
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
	});

	it("inicia com diálogo fechado e nenhum dependente em edição", () => {
		const { result } = renderHook(() => useDependentsPage());
		expect(result.current.dialogOpen).toBe(false);
		expect(result.current.editing).toBeNull();
	});

	it("openCreate abre o diálogo sem dependente em edição", () => {
		const { result } = renderHook(() => useDependentsPage());
		act(() => result.current.openCreate());
		expect(result.current.dialogOpen).toBe(true);
		expect(result.current.editing).toBeNull();
	});

	it("openEdit abre o diálogo com o dependente selecionado", () => {
		const { result } = renderHook(() => useDependentsPage());
		const dep = { id: "d-1", name: "João" };
		act(() => result.current.openEdit(dep as never));
		expect(result.current.dialogOpen).toBe(true);
		expect(result.current.editing).toEqual(dep);
	});

	it("handleDelete chama a mutation e mostra toast de sucesso", async () => {
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const { result } = renderHook(() => useDependentsPage());
		await act(async () => {
			await result.current.handleDelete("d-1");
		});
		expect(mutateAsync).toHaveBeenCalledWith("d-1");
		expect(toast.success).toHaveBeenCalledWith("Dependente removido.");
	});

	it("handleDelete mostra toast de erro quando a mutation falha", async () => {
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		const { result } = renderHook(() => useDependentsPage());
		await act(async () => {
			await result.current.handleDelete("d-1");
		});
		expect(toast.error).toHaveBeenCalledWith("Erro ao remover dependente.");
	});

	it("deleting reflete o estado da mutation", () => {
		mockUseDeleteDependent.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		const { result } = renderHook(() => useDependentsPage());
		expect(result.current.deleting).toBe(true);
	});
});
