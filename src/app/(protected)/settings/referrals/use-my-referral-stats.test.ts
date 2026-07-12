import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		getMyReferralStats: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useMyReferralStats } from "./use-my-referral-stats";

const mockGetMyReferralStats = vi.mocked(
	billingWalletRepository.getMyReferralStats,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useMyReferralStats", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as estatisticas de indicacao do usuario logado", async () => {
		const stats = { totalReferrals: 3, code: "ABC123" };
		mockGetMyReferralStats.mockResolvedValueOnce(stats as never);
		const { result } = renderHook(() => useMyReferralStats(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(stats);
	});
});
