import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/services/professional-services.api", () => ({
	professionalServicesApi: {
		getByProfessional: vi.fn(),
		create: vi.fn(),
		deactivate: vi.fn(),
		update: vi.fn(),
	},
}));

import { professionalServicesApi } from "@/lib/api/services/professional-services.api";
import { useDeactivateService } from "./use-deactivate-service";

const mockDeactivate = vi.mocked(professionalServicesApi.deactivate);

const service = { id: "svc-1", title: "Consulta", price: 150, active: true };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useDeactivateService", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls deactivate with serviceId", async () => {
		mockDeactivate.mockResolvedValueOnce(service as never);
		const { result } = renderHook(() => useDeactivateService(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("svc-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeactivate).toHaveBeenCalledWith("svc-1");
	});
});
