import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professional-settings.api", () => ({
	professionalSettingsApi: {
		updatePaymentSettings: vi.fn(),
		setConsultationPrice: vi.fn(),
	},
}));

import { professionalSettingsApi } from "@/lib/api/professionals/professional-settings.api";
import { useUpdatePaymentSettings } from "./use-update-payment-settings";

const mockUpdatePaymentSettings = vi.mocked(
	professionalSettingsApi.updatePaymentSettings,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdatePaymentSettings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls updatePaymentSettings with data", async () => {
		mockUpdatePaymentSettings.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useUpdatePaymentSettings(), {
			wrapper: wrapper(),
		});
		const data = { acceptsPix: true, acceptsCreditCard: true };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdatePaymentSettings).toHaveBeenCalledWith(data);
	});
});
