import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(
	"@/features/subscriptions/repositories/subscriptions.repository",
	() => ({
		subscriptionsRepository: {
			getMy: vi.fn(),
			createCheckout: vi.fn(),
			adminListAll: vi.fn(),
			adminCancel: vi.fn(),
		},
	}),
);

import { subscriptionsRepository } from "@/features/subscriptions/repositories/subscriptions.repository";
import { useMySubscription } from "./use-my-subscription";

const mockGetMy = vi.mocked(subscriptionsRepository.getMy);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMySubscription", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a assinatura do usuario logado", async () => {
		const subscription = { id: "sub-1", status: "ACTIVE" };
		mockGetMy.mockResolvedValueOnce(subscription as never);
		const { result } = renderHook(() => useMySubscription(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(subscription);
	});
});
