import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
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
import { useAdminCancelSubscription } from "./use-admin-cancel-subscription";

const mockAdminCancel = vi.mocked(subscriptionsRepository.adminCancel);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useAdminCancelSubscription", () => {
	beforeEach(() => vi.clearAllMocks());

	it("cancela a assinatura e invalida a query de admin subscriptions", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		mockAdminCancel.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useAdminCancelSubscription(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync("sub-1");
		});
		expect(mockAdminCancel).toHaveBeenCalledWith("sub-1");
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["admin", "subscriptions"],
		});
	});
});
