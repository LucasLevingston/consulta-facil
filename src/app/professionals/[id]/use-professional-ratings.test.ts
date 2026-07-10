import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/professionals.api", () => ({
	professionalsListingApi: {
		getRatings: vi.fn(),
	},
}));

import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import { useProfessionalRatings } from "./use-professional-ratings";

const mockGetRatings = vi.mocked(professionalsListingApi.getRatings);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useProfessionalRatings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as avaliações do profissional", async () => {
		const rating = { average: 4.5, total: 20 };
		mockGetRatings.mockResolvedValueOnce(rating as never);
		const { result } = renderHook(() => useProfessionalRatings("prof-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual(rating);
		expect(mockGetRatings).toHaveBeenCalledWith("prof-1");
	});
});
