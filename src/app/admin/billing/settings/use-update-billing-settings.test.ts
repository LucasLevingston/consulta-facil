import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-settings.repository", () => ({
	billingSettingsRepository: {
		updateSettings: vi.fn(),
	},
}));

import { billingSettingsRepository } from "@/features/billing/repositories/billing-settings.repository";
import { useUpdateBillingSettings } from "./use-update-billing-settings";

const mockUpdateSettings = vi.mocked(billingSettingsRepository.updateSettings);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useUpdateBillingSettings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama updateSettings e invalida a query de settings", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { commissionPercentage: 15 };
		mockUpdateSettings.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateBillingSettings(), {
			wrapper: w,
		});
		await act(async () => {
			await result.current.mutateAsync({ commissionPercentage: 15 } as never);
		});
		expect(mockUpdateSettings).toHaveBeenCalledWith({
			commissionPercentage: 15,
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "settings"],
		});
	});
});
