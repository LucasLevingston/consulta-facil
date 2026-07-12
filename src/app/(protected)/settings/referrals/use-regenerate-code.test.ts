import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-wallet.repository", () => ({
	billingWalletRepository: {
		regenerateReferralCode: vi.fn(),
	},
}));

import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";
import { useRegenerateCode } from "./use-regenerate-code";

const mockRegenerateReferralCode = vi.mocked(
	billingWalletRepository.regenerateReferralCode,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

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
