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
import { useDeleteCertificate } from "./use-delete-certificate";

const mockDeleteCertificate = vi.mocked(
	professionalPortfolioApi.deleteCertificate,
);
const professional = { id: "prof-1", name: "Dr. João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useDeleteCertificate", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.deleteCertificate com o id", async () => {
		mockDeleteCertificate.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useDeleteCertificate(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("cert-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteCertificate).toHaveBeenCalledWith("cert-1");
	});
});
