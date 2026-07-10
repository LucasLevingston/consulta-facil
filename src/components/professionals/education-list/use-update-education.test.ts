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
vi.mock("@/lib/api/professionals/professional-portfolio.api", () => ({
	professionalPortfolioApi: {
		updateEducation: vi.fn(),
		updateExperience: vi.fn(),
		updateCertificate: vi.fn(),
	},
}));

import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { useUpdateEducation } from "./use-update-education";

const mockUpdateEducation = vi.mocked(professionalPortfolioApi.updateEducation);
const professional = { id: "prof-1", name: "Dr. João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateEducation", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.updateEducation com id e dados", async () => {
		const data = { institution: "USP", course: "Medicina", startYear: 2010 };
		mockUpdateEducation.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateEducation(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ educationId: "edu-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateEducation).toHaveBeenCalledWith("edu-1", data);
	});
});
