import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		adminListWallets: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useAdminWallets } from "./use-admin-wallets";

const mockAdminListWallets = vi.mocked(
	billingWalletRepository.adminListWallets,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useAdminWallets", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de carteiras do admin", async () => {
		const wallets = [{ id: "w-1", balance: 200 }];
		mockAdminListWallets.mockResolvedValueOnce(wallets as never);
		const { result } = renderHook(() => useAdminWallets(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(wallets);
	});
});
