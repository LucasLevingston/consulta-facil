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
import { useUpdateSocialLinks } from "./use-update-social-links";

const mockUpdateSocialLinks = vi.mocked(
	professionalProfileApi.updateSocialLinks,
);
const professional = { id: "prof-1", name: "Dr. João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateSocialLinks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalProfileApi.updateSocialLinks com os dados corretos", async () => {
		const data = { instagram: "https://instagram.com/dr.joao" };
		mockUpdateSocialLinks.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateSocialLinks(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateSocialLinks).toHaveBeenCalledWith(data);
	});
});
