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
import { useGetProfessionalServices } from "./use-get-professional-services";

const mockGetByProfessional = vi.mocked(
	professionalServicesApi.getByProfessional,
);

const service = { id: "svc-1", title: "Consulta", price: 150, active: true };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useGetProfessionalServices", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useGetProfessionalServices(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when professionalId provided", async () => {
		mockGetByProfessional.mockResolvedValueOnce([service] as never);
		const { result } = renderHook(() => useGetProfessionalServices("prof-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
