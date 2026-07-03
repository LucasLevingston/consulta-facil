import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/dependents/repositories/dependents.repository", () => ({
	dependentsRepository: {
		getMy: vi.fn().mockResolvedValue([]),
		create: vi.fn().mockResolvedValue({}),
		update: vi.fn().mockResolvedValue({}),
		remove: vi.fn().mockResolvedValue(undefined),
	},
}));

import { useCreateDependent } from "@/features/dependents/hooks/use-create-dependent";
import { useDeleteDependent } from "@/features/dependents/hooks/use-delete-dependent";
import { useMyDependents } from "@/features/dependents/hooks/use-my-dependents";
import { useUpdateDependent } from "@/features/dependents/hooks/use-update-dependent";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("dependents hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("useMyDependents returns data and isLoading", () => {
		const { result } = renderHook(() => useMyDependents(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useCreateDependent returns mutate and isPending", () => {
		const { result } = renderHook(() => useCreateDependent(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});

	it("useUpdateDependent returns mutate and isPending", () => {
		const { result } = renderHook(() => useUpdateDependent(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});

	it("useDeleteDependent returns mutate and isPending", () => {
		const { result } = renderHook(() => useDeleteDependent(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
