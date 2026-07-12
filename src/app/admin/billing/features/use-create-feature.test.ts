import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-content.repository", () => ({
	billingContentRepository: {
		createFeature: vi.fn(),
	},
}));

import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import { useCreateFeature } from "./use-create-feature";

const mockCreateFeature = vi.mocked(billingContentRepository.createFeature);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useCreateFeature", () => {
	beforeEach(() => vi.clearAllMocks());

	it("cria uma feature e invalida a query de features", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const newFeature = { id: "f-2", title: "Nova feature" };
		mockCreateFeature.mockResolvedValueOnce(newFeature as never);
		const { result } = renderHook(() => useCreateFeature(), { wrapper: w });
		const payload = { title: "Nova feature" };
		await act(async () => {
			await result.current.mutateAsync(payload as never);
		});
		expect(mockCreateFeature).toHaveBeenCalledWith(payload);
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "features"],
		});
	});
});
