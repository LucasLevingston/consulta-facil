import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockMutateAsync = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock("@/features/dependents/hooks/use-my-dependents", () => ({
	useMyDependents: vi.fn().mockReturnValue({ data: [], isLoading: false }),
}));

vi.mock("@/features/dependents/hooks/use-delete-dependent", () => ({
	useDeleteDependent: vi.fn().mockReturnValue({
		mutateAsync: mockMutateAsync,
		isPending: false,
	}),
}));

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { toast } from "sonner";
import { useDependentsController } from "@/features/dependents/controllers/use-dependents.controller";

describe("useDependentsController", () => {
	beforeEach(() => vi.clearAllMocks());

	it("returns initial state", () => {
		const { result } = renderHook(() => useDependentsController());
		expect(result.current.dependents).toEqual([]);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.dialogOpen).toBe(false);
		expect(result.current.editing).toBeNull();
		expect(result.current.deleting).toBe(false);
	});

	it("openCreate sets dialogOpen true and editing null", () => {
		const { result } = renderHook(() => useDependentsController());
		act(() => result.current.openCreate());
		expect(result.current.dialogOpen).toBe(true);
		expect(result.current.editing).toBeNull();
	});

	it("openEdit sets editing and opens dialog", () => {
		const dep = { id: "d1", name: "Test" } as never;
		const { result } = renderHook(() => useDependentsController());
		act(() => result.current.openEdit(dep));
		expect(result.current.editing).toEqual(dep);
		expect(result.current.dialogOpen).toBe(true);
	});

	it("handleDelete calls toast.success on success", async () => {
		const { result } = renderHook(() => useDependentsController());
		await act(async () => {
			await result.current.handleDelete("d1");
		});
		expect(toast.success).toHaveBeenCalled();
	});

	it("handleDelete calls toast.error on failure", async () => {
		mockMutateAsync.mockRejectedValueOnce(new Error("fail"));
		const { result } = renderHook(() => useDependentsController());
		await act(async () => {
			await result.current.handleDelete("d1");
		});
		expect(toast.error).toHaveBeenCalled();
	});
});
