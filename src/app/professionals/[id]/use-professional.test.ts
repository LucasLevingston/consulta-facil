import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
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
import { useProfessional } from "./use-professional";

const mockGetById = vi.mocked(professionalsListingApi.getById);
const professional = { id: "d-1", name: "Dra. Ana", specialty: "Cardiologia" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when id provided", async () => {
		mockGetById.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useProfessional("d-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data.id).toBe("d-1");
	});
});
