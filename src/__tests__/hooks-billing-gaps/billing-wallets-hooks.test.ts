import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/billing/wallet.api", () => ({
	walletApi: {
		myWallet: vi.fn(),
		myTransactions: vi.fn(),
		adminListAll: vi.fn(),
		adminGetWallet: vi.fn(),
		adminGetTransactions: vi.fn(),
	},
}));

import { useAdminWallets } from "@/hooks/api/billing/use-admin-wallets";
import { useMyWallet } from "@/hooks/api/billing/use-my-wallet";
import { useMyWalletTransactions } from "@/hooks/api/billing/use-my-wallet-transactions";
import { useUserWallet } from "@/hooks/api/billing/use-user-wallet";
import { useUserWalletTransactions } from "@/hooks/api/billing/use-user-wallet-transactions";
import { walletApi } from "@/lib/api/billing/wallet.api";

const mockMyWallet = vi.mocked(walletApi.myWallet);
const mockMyTransactions = vi.mocked(walletApi.myTransactions);
const mockAdminListAll = vi.mocked(walletApi.adminListAll);
const mockAdminGetWallet = vi.mocked(walletApi.adminGetWallet);
const mockAdminGetTransactions = vi.mocked(walletApi.adminGetTransactions);

const wallet = { id: "wallet-1", userId: "user-1", balance: 100 };
const transaction = {
	id: "tx-1",
	walletId: "wallet-1",
	amount: 50,
	type: "CREDIT",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminWallets", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca todas as carteiras administrativas com sucesso", async () => {
		mockAdminListAll.mockResolvedValueOnce([wallet] as never);
		const { result } = renderHook(() => useAdminWallets(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([wallet]);
		expect(mockAdminListAll).toHaveBeenCalledTimes(1);
	});
});

describe("useMyWallet", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a carteira do usuário logado com sucesso", async () => {
		mockMyWallet.mockResolvedValueOnce(wallet as never);
		const { result } = renderHook(() => useMyWallet(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(wallet);
		expect(mockMyWallet).toHaveBeenCalledTimes(1);
	});
});

describe("useMyWalletTransactions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as transações do usuário logado com sucesso", async () => {
		mockMyTransactions.mockResolvedValueOnce([transaction] as never);
		const { result } = renderHook(() => useMyWalletTransactions(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([transaction]);
		expect(mockMyTransactions).toHaveBeenCalledTimes(1);
	});
});

describe("useUserWallet", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fica desabilitado quando userId está vazio", () => {
		const { result } = renderHook(() => useUserWallet(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca a carteira do usuário quando userId é fornecido", async () => {
		mockAdminGetWallet.mockResolvedValueOnce(wallet as never);
		const { result } = renderHook(() => useUserWallet("user-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(wallet);
		expect(mockAdminGetWallet).toHaveBeenCalledWith("user-1");
	});
});

describe("useUserWalletTransactions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fica desabilitado quando userId está vazio", () => {
		const { result } = renderHook(() => useUserWalletTransactions(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca as transações do usuário quando userId é fornecido", async () => {
		mockAdminGetTransactions.mockResolvedValueOnce([transaction] as never);
		const { result } = renderHook(() => useUserWalletTransactions("user-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([transaction]);
		expect(mockAdminGetTransactions).toHaveBeenCalledWith("user-1");
	});
});
