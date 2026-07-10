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
import { useAdminSubscriptions } from "./use-admin-subscriptions";

const mockAdminListAll = vi.mocked(subscriptionsRepository.adminListAll);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminSubscriptions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de assinaturas do admin", async () => {
		const subscriptions = [{ id: "sub-1" }, { id: "sub-2" }];
		mockAdminListAll.mockResolvedValueOnce(subscriptions as never);
		const { result } = renderHook(() => useAdminSubscriptions(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(subscriptions);
	});
});
