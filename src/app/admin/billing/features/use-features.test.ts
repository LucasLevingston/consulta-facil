import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-content.repository", () => ({
	billingContentRepository: {
		listFeatures: vi.fn(),
	},
}));

import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import { useFeatures } from "./use-features";

const mockListFeatures = vi.mocked(billingContentRepository.listFeatures);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useFeatures", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de features", async () => {
		const features = [{ id: "f-1", title: "Feature 1" }];
		mockListFeatures.mockResolvedValueOnce(features as never);
		const { result } = renderHook(() => useFeatures(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(features);
	});
});
