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
import { useUpdateExperience } from "./use-update-experience";

const mockUpdateExperience = vi.mocked(
	professionalPortfolioApi.updateExperience,
);
const professional = { id: "prof-1", name: "Dr. João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateExperience", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.updateExperience com id e dados", async () => {
		const data = {
			company: "Hospital X",
			role: "Clínico Geral",
			startYear: 2015,
		};
		mockUpdateExperience.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateExperience(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ experienceId: "exp-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateExperience).toHaveBeenCalledWith("exp-1", data);
	});
});
