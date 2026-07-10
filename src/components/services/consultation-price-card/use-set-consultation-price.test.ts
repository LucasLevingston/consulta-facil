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
import { useSetConsultationPrice } from "./use-set-consultation-price";

const mockSetConsultationPrice = vi.mocked(
	professionalSettingsApi.setConsultationPrice,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useSetConsultationPrice", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls setConsultationPrice with price", async () => {
		mockSetConsultationPrice.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useSetConsultationPrice(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(200);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSetConsultationPrice).toHaveBeenCalledWith(200);
	});
});
