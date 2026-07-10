import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
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
vi.mock("@/lib/api/professionals/professional-profile.api", () => ({
	professionalProfileApi: {
		updateBio: vi.fn(),
		updateSocialLinks: vi.fn(),
		updateCouncil: vi.fn(),
		updateAddress: vi.fn(),
	},
}));

import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import { useUpdateCouncil } from "./use-update-council";

const mockUpdateCouncil = vi.mocked(professionalProfileApi.updateCouncil);
const professional = { id: "prof-1", name: "Dr. João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateCouncil", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalProfileApi.updateCouncil com os dados corretos", async () => {
		const data = { council: "CRM", councilNumber: "123456", state: "SP" };
		mockUpdateCouncil.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateCouncil(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateCouncil).toHaveBeenCalledWith(data);
	});
});
