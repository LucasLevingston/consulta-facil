import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-content.repository", () => ({
	billingContentRepository: {
		updateFeature: vi.fn(),
	},
}));

import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import { useUpdateFeature } from "./use-update-feature";

const mockUpdateFeature = vi.mocked(billingContentRepository.updateFeature);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useUpdateFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("atualiza uma feature e invalida a query de features", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { id: "f-1", title: "Atualizada" };
		mockUpdateFeature.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateFeature(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync({
				id: "f-1",
				data: { title: "Atualizada" } as never,
			});
		});
		expect(mockUpdateFeature).toHaveBeenCalledWith("f-1", {
			title: "Atualizada",
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "features"],
		});
	});
});
