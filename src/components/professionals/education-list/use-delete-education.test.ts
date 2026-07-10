import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professional-portfolio.api", () => ({
	professionalPortfolioApi: {
		addEducation: vi.fn(),
		deleteEducation: vi.fn(),
		addExperience: vi.fn(),
		deleteExperience: vi.fn(),
		addCertificate: vi.fn(),
		deleteCertificate: vi.fn(),
	},
}));

import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { useDeleteEducation } from "./use-delete-education";

const mockDeleteEducation = vi.mocked(professionalPortfolioApi.deleteEducation);
const professional = { id: "prof-1", name: "Dr. João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useDeleteEducation", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.deleteEducation com o id", async () => {
		mockDeleteEducation.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useDeleteEducation(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("edu-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteEducation).toHaveBeenCalledWith("edu-1");
	});
});
