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
vi.mock("@/lib/api/professionals/professionals.api", () => ({
	professionalsListingApi: {
		getAll: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
	},
}));

import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import { useProfessionalsNearby } from "./use-professionals-nearby";

const mockGetNearby = vi.mocked(professionalsListingApi.getNearby);
const professional = { id: "d-1", name: "Dra. Ana", specialty: "Cardiologia" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useProfessionalsNearby", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when lat/lng null", () => {
		const { result } = renderHook(() => useProfessionalsNearby(null, null), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("enabled with lat/lng", async () => {
		mockGetNearby.mockResolvedValueOnce([professional] as never);
		const { result } = renderHook(() => useProfessionalsNearby(-23.5, -46.6), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
