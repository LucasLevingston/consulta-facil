import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-settings.repository", () => ({
	billingSettingsRepository: {
		getFeeConfig: vi.fn(),
	},
}));

import { billingSettingsRepository } from "@/features/billing/repositories/billing-settings.repository";
import { useFeeConfig } from "./use-fee-config";

const mockGetFeeConfig = vi.mocked(billingSettingsRepository.getFeeConfig);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useFeeConfig", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a configuracao de taxas", async () => {
		const feeConfig = { percentage: 5 };
		mockGetFeeConfig.mockResolvedValueOnce(feeConfig as never);
		const { result } = renderHook(() => useFeeConfig(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(feeConfig);
	});
});
