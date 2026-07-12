import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-content.repository", () => ({
	billingContentRepository: {
		listSystemFees: vi.fn(),
	},
}));

import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import { useSystemFees } from "./use-system-fees";

const mockListSystemFees = vi.mocked(billingContentRepository.listSystemFees);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useSystemFees", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de taxas do sistema", async () => {
		const fees = [{ id: "sf-1", percentage: 2 }];
		mockListSystemFees.mockResolvedValueOnce(fees as never);
		const { result } = renderHook(() => useSystemFees(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(fees);
	});
});
