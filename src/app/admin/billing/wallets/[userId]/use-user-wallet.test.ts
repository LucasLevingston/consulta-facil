import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		getUserWallet: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useUserWallet } from "./use-user-wallet";

const mockGetUserWallet = vi.mocked(billingWalletRepository.getUserWallet);

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

describe("useUserWallet", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a carteira do usuario informado", async () => {
		const walletData = { id: "w-2", balance: 300 };
		mockGetUserWallet.mockResolvedValueOnce(walletData as never);
		const { result } = renderHook(() => useUserWallet("u-1"), wrapper());
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(mockGetUserWallet).toHaveBeenCalledWith("u-1");
		expect(result.current.data).toEqual(walletData);
	});
});
