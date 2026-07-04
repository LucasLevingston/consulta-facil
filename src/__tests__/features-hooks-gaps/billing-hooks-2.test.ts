import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		getMyReferralStats: vi.fn(),
		regenerateReferralCode: vi.fn(),
		adminListReferrals: vi.fn(),
		getMyWallet: vi.fn(),
		getMyWalletTransactions: vi.fn(),
		adminListWallets: vi.fn(),
		getUserWallet: vi.fn(),
		getUserWalletTransactions: vi.fn(),
	},
}));

import { useAdminReferrals } from "@/features/billing/hooks/use-admin-referrals";
import { useAdminWallets } from "@/features/billing/hooks/use-admin-wallets";
import { useMyReferralStats } from "@/features/billing/hooks/use-my-referral-stats";
import { useMyWallet } from "@/features/billing/hooks/use-my-wallet";
import { useMyWalletTransactions } from "@/features/billing/hooks/use-my-wallet-transactions";
import { useRegenerateCode } from "@/features/billing/hooks/use-regenerate-code";
import { useUserWallet } from "@/features/billing/hooks/use-user-wallet";
import { useUserWalletTransactions } from "@/features/billing/hooks/use-user-wallet-transactions";
import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";

const mockGetMyReferralStats = vi.mocked(
	billingWalletRepository.getMyReferralStats,
);
const mockRegenerateReferralCode = vi.mocked(
	billingWalletRepository.regenerateReferralCode,
);
const mockAdminListReferrals = vi.mocked(
	billingWalletRepository.adminListReferrals,
);
const mockGetMyWallet = vi.mocked(billingWalletRepository.getMyWallet);
const mockGetMyWalletTransactions = vi.mocked(
	billingWalletRepository.getMyWalletTransactions,
);
const mockAdminListWallets = vi.mocked(
	billingWalletRepository.adminListWallets,
);
const mockGetUserWallet = vi.mocked(billingWalletRepository.getUserWallet);
const mockGetUserWalletTransactions = vi.mocked(
	billingWalletRepository.getUserWalletTransactions,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
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

describe("useRegenerateCode", () => {
	beforeEach(() => vi.clearAllMocks());

	it("regenera o codigo de indicacao e invalida referral-stats-me", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		mockRegenerateReferralCode.mockResolvedValueOnce({
			code: "NEWCODE",
		} as never);
		const { result } = renderHook(() => useRegenerateCode(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync();
		});
		expect(mockRegenerateReferralCode).toHaveBeenCalled();
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["referral-stats-me"],
		});
	});
});

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

describe("useUserWallet", () => {
	beforeEach(() => vi.clearAllMocks());

	it("desabilitado quando userId vazio", () => {
		const { result } = renderHook(() => useUserWallet(""), wrapper());
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca a carteira do usuario informado", async () => {
		const walletData = { id: "w-2", balance: 300 };
		mockGetUserWallet.mockResolvedValueOnce(walletData as never);
		const { result } = renderHook(() => useUserWallet("u-1"), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetUserWallet).toHaveBeenCalledWith("u-1");
		expect(result.current.data).toEqual(walletData);
	});
});

describe("useUserWalletTransactions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("desabilitado quando userId vazio", () => {
		const { result } = renderHook(
			() => useUserWalletTransactions(""),
			wrapper(),
		);
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca as transacoes da carteira do usuario informado", async () => {
		const transactions = [{ id: "t-2", amount: 75 }];
		mockGetUserWalletTransactions.mockResolvedValueOnce(transactions as never);
		const { result } = renderHook(
			() => useUserWalletTransactions("u-1"),
			wrapper(),
		);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetUserWalletTransactions).toHaveBeenCalledWith("u-1");
		expect(result.current.data).toEqual(transactions);
	});
});
