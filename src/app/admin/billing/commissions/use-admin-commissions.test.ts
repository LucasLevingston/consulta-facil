import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-settings.repository", () => ({
	billingSettingsRepository: {
		adminListCommissions: vi.fn(),
	},
}));

import { billingSettingsRepository } from "@/features/billing/repositories/billing-settings.repository";
import { useAdminCommissions } from "./use-admin-commissions";

const mockAdminListCommissions = vi.mocked(
	billingSettingsRepository.adminListCommissions,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return {
		wrapper: ({ children }: { children: React.ReactNode }) =>
			createElement(QueryClientProvider, { client: qc }, children),
	};
}

describe("useAdminCommissions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de comissoes do admin", async () => {
		const commissions = [{ id: "c-1", value: 10 }];
		mockAdminListCommissions.mockResolvedValueOnce(commissions as never);
		const { result } = renderHook(() => useAdminCommissions(), wrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(commissions);
	});
});
