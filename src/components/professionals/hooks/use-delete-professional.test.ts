import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professional-profile.api", () => ({
	professionalProfileApi: {
		update: vi.fn(),
		delete: vi.fn(),
	},
}));

import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import { useDeleteProfessional } from "./use-delete-professional";

const mockDelete = vi.mocked(professionalProfileApi.delete);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useDeleteProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls delete with professionalId", async () => {
		mockDelete.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteProfessional(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("prof-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDelete).toHaveBeenCalledWith("prof-1");
	});
});
