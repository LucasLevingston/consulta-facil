import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/dependents/repositories/dependents.repository", () => ({
	dependentsRepository: {
		getMy: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
	},
}));

import { dependentsRepository } from "@/features/dependents/repositories/dependents.repository";
import { useDeleteDependent } from "./use-delete-dependent";

const mockRemoveDependent = vi.mocked(dependentsRepository.remove);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useDeleteDependent", () => {
	beforeEach(() => vi.clearAllMocks());

	it("remove um dependente e invalida a query de dependentes", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		mockRemoveDependent.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteDependent(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync("dep-1");
		});
		expect(mockRemoveDependent).toHaveBeenCalledWith("dep-1");
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["dependents", "my"],
		});
	});
});
