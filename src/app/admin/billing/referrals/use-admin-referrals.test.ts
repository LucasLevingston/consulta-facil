import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		adminListReferrals: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useAdminReferrals } from "./use-admin-referrals";

const mockAdminListReferrals = vi.mocked(
	billingWalletRepository.adminListReferrals,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useAdminReferrals", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de indicacoes do admin", async () => {
		const referrals = [{ id: "r-1" }];
		mockAdminListReferrals.mockResolvedValueOnce(referrals as never);
		const { result } = renderHook(() => useAdminReferrals(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(referrals);
	});
});
