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
import { useAddEducation } from "./use-add-education";

const mockAddEducation = vi.mocked(professionalPortfolioApi.addEducation);
const professional = { id: "prof-1", name: "Dr. João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAddEducation", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.addEducation com os dados corretos", async () => {
		const data = { institution: "USP", course: "Medicina", startYear: 2010 };
		mockAddEducation.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useAddEducation(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddEducation).toHaveBeenCalledWith(data);
	});
});
