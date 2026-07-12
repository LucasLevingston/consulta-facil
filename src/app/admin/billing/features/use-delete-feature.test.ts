import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-content.repository", () => ({
	billingContentRepository: {
		deleteFeature: vi.fn(),
	},
}));

import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import { useDeleteFeature } from "./use-delete-feature";

const mockDeleteFeature = vi.mocked(billingContentRepository.deleteFeature);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useDeleteFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("remove uma feature e invalida a query de features", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		mockDeleteFeature.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteFeature(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync("f-1");
		});
		expect(mockDeleteFeature).toHaveBeenCalledWith("f-1");
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "features"],
		});
	});
});
