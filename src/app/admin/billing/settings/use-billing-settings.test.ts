import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-settings.repository", () => ({
	billingSettingsRepository: {
		getSettings: vi.fn(),
	},
}));

import { billingSettingsRepository } from "@/features/billing/repositories/billing-settings.repository";
import { useBillingSettings } from "./use-billing-settings";

const mockGetSettings = vi.mocked(billingSettingsRepository.getSettings);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useBillingSettings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as configuracoes de billing", async () => {
		const settings = { commissionPercentage: 10 };
		mockGetSettings.mockResolvedValueOnce(settings as never);
		const { result } = renderHook(() => useBillingSettings(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(settings);
	});
});
