import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professional-applications.api", () => ({
	professionalApplicationsApi: {
		create: vi.fn(),
		approve: vi.fn(),
		reject: vi.fn(),
		getPendingApplications: vi.fn(),
		getApplicationStatus: vi.fn(),
	},
}));

import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { useRejectApplication } from "./use-reject-application";

const mockReject = vi.mocked(professionalApplicationsApi.reject);

const professional = {
	id: "prof-1",
	name: "Dr. Silva",
	specialty: "Cardiologia",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useRejectApplication", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls reject with professionalId", async () => {
		mockReject.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useRejectApplication(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("prof-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockReject).toHaveBeenCalledWith("prof-1");
	});
});
