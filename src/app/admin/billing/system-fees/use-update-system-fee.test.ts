import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-content.repository", () => ({
	billingContentRepository: {
		updateSystemFee: vi.fn(),
	},
}));

import { billingContentRepository } from "@/features/billing/repositories/billing-content.repository";
import { useUpdateSystemFee } from "./use-update-system-fee";

const mockUpdateSystemFee = vi.mocked(billingContentRepository.updateSystemFee);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
		qc,
	};
}

describe("useUpdateSystemFee", () => {
	beforeEach(() => vi.clearAllMocks());

	it("atualiza uma taxa do sistema e invalida a query de system-fees", async () => {
		const { qc, wrapper: w } = wrapper();
		const invalidateSpy = vi.spyOn(qc, "invalidateQueries");
		const updated = { id: "sf-1", percentage: 3 };
		mockUpdateSystemFee.mockResolvedValueOnce(updated as never);
		const { result } = renderHook(() => useUpdateSystemFee(), { wrapper: w });
		await act(async () => {
			await result.current.mutateAsync({
				id: "sf-1",
				data: { percentage: 3 } as never,
			});
		});
		expect(mockUpdateSystemFee).toHaveBeenCalledWith("sf-1", {
			percentage: 3,
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["billing", "system-fees"],
		});
	});
});
