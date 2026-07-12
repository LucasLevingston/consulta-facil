import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		getMyWalletTransactions: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useMyWalletTransactions } from "./use-my-wallet-transactions";

const mockGetMyWalletTransactions = vi.mocked(
	billingWalletRepository.getMyWalletTransactions,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useMyWalletTransactions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as transacoes da carteira do usuario logado", async () => {
		const transactions = [{ id: "t-1", amount: 50 }];
		mockGetMyWalletTransactions.mockResolvedValueOnce(transactions as never);
		const { result } = renderHook(() => useMyWalletTransactions(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(transactions);
	});
});
