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
import { useUpdateService } from "./use-update-service";

const mockUpdate = vi.mocked(professionalServicesApi.update);

const service = { id: "svc-1", title: "Consulta", price: 150, active: true };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateService", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls update with serviceId and data", async () => {
		mockUpdate.mockResolvedValueOnce(service as never);
		const { result } = renderHook(() => useUpdateService(), {
			wrapper: wrapper(),
		});
		const data = { title: "Consulta Premium" };
		await act(async () => {
			result.current.mutate({ serviceId: "svc-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdate).toHaveBeenCalledWith("svc-1", data);
	});
});
