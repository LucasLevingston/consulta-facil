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
import { useUpdateDependent } from "./use-update-dependent";

const mockUpdateDependent = vi.mocked(dependentsRepository.update);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useUpdateDependent", () => {
	beforeEach(() => vi.clearAllMocks());

	it("atualiza um dependente e invalida a query de dependentes", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { id: "dep-1", name: "Maria Atualizada" };
		mockUpdateDependent.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateDependent(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync({
				id: "dep-1",
				data: { name: "Maria Atualizada" } as never,
			});
		});
		expect(mockUpdateDependent).toHaveBeenCalledWith("dep-1", {
			name: "Maria Atualizada",
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["dependents", "my"],
		});
	});
});
