import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		getUserWalletTransactions: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useUserWalletTransactions } from "./use-user-wallet-transactions";

const mockGetUserWalletTransactions = vi.mocked(
	billingWalletRepository.getUserWalletTransactions,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(
				QueryClientProvider,
				{ client: qc },
				createElement(Suspense, { fallback: null }, children),
			),
	};
}

describe("useUserWalletTransactions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as transacoes da carteira do usuario informado", async () => {
		const transactions = [{ id: "t-2", amount: 75 }];
		mockGetUserWalletTransactions.mockResolvedValueOnce(transactions as never);
		const { result } = renderHook(
			() => useUserWalletTransactions("u-1"),
			wrapper(),
		);
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(mockGetUserWalletTransactions).toHaveBeenCalledWith("u-1");
		expect(result.current.data).toEqual(transactions);
	});
});
