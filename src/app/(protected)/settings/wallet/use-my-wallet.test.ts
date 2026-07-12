import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		getMyWallet: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useMyWallet } from "./use-my-wallet";

const mockGetMyWallet = vi.mocked(billingWalletRepository.getMyWallet);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useMyWallet", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a carteira do usuario logado", async () => {
		const walletData = { id: "w-1", balance: 100 };
		mockGetMyWallet.mockResolvedValueOnce(walletData as never);
		const { result } = renderHook(() => useMyWallet(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(walletData);
	});
});
