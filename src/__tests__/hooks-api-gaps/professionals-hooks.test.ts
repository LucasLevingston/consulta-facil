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

import { useAddCertificate } from "@/features/professionals/hooks/use-add-certificate";
import { useAddEducation } from "@/features/professionals/hooks/use-add-education";
import { useAddExperience } from "@/features/professionals/hooks/use-add-experience";
import { useDeleteCertificate } from "@/features/professionals/hooks/use-delete-certificate";
import { useDeleteEducation } from "@/features/professionals/hooks/use-delete-education";
import { useDeleteExperience } from "@/features/professionals/hooks/use-delete-experience";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";

const mockAddEducation = vi.mocked(professionalPortfolioApi.addEducation);
const mockDeleteEducation = vi.mocked(professionalPortfolioApi.deleteEducation);
const mockAddExperience = vi.mocked(professionalPortfolioApi.addExperience);
const mockDeleteExperience = vi.mocked(
	professionalPortfolioApi.deleteExperience,
);
const mockAddCertificate = vi.mocked(professionalPortfolioApi.addCertificate);
const mockDeleteCertificate = vi.mocked(
	professionalPortfolioApi.deleteCertificate,
);

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

describe("useAddExperience", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.addExperience com os dados corretos", async () => {
		const data = {
			company: "Hospital X",
			role: "Clínico Geral",
			startYear: 2015,
		};
		mockAddExperience.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useAddExperience(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddExperience).toHaveBeenCalledWith(data);
	});
});

describe("useDeleteExperience", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.deleteExperience com o id", async () => {
		mockDeleteExperience.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useDeleteExperience(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("exp-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteExperience).toHaveBeenCalledWith("exp-1");
	});
});

describe("useAddCertificate", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.addCertificate com os dados corretos", async () => {
		const data = { name: "Cardiologia Avançada", issuer: "SBC", year: 2020 };
		mockAddCertificate.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useAddCertificate(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddCertificate).toHaveBeenCalledWith(data);
	});
});

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
