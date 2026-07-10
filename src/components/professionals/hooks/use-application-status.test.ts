import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { headers: { common: {} } },
	},
}));
vi.mock("@/lib/api/professionals/professional-applications.api", () => ({
	professionalApplicationsApi: {
		getPendingApplications: vi.fn(),
		getApplicationStatus: vi.fn(),
	},
}));

import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { useApplicationStatus } from "./use-application-status";

const mockAppStatus = vi.mocked(
	professionalApplicationsApi.getApplicationStatus,
);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useApplicationStatus", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches application status", async () => {
		mockAppStatus.mockResolvedValueOnce({
			id: "p-1",
			status: "PENDING",
		} as never);
		const { result } = renderHook(() => useApplicationStatus(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
