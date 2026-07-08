import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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
vi.mock("@/lib/api/professionals/professional-portfolio.api", () => ({
	professionalPortfolioApi: {
		updateEducation: vi.fn(),
		updateExperience: vi.fn(),
		updateCertificate: vi.fn(),
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
vi.mock("@/lib/api/professionals/professionals.api", () => ({
	professionalsListingApi: {
		getRatings: vi.fn(),
	},
}));

import { useProfessionalRatings } from "@/features/professionals/hooks/use-professional-ratings";
import { useUpdateAddress } from "@/features/professionals/hooks/use-update-address";
import { useUpdateBio } from "@/features/professionals/hooks/use-update-bio";
import { useUpdateCertificate } from "@/features/professionals/hooks/use-update-certificate";
import { useUpdateCouncil } from "@/features/professionals/hooks/use-update-council";
import { useUpdateEducation } from "@/features/professionals/hooks/use-update-education";
import { useUpdateExperience } from "@/features/professionals/hooks/use-update-experience";
import { useUpdateSocialLinks } from "@/features/professionals/hooks/use-update-social-links";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockUpdateEducation = vi.mocked(professionalPortfolioApi.updateEducation);
const mockUpdateExperience = vi.mocked(
	professionalPortfolioApi.updateExperience,
);
const mockUpdateCertificate = vi.mocked(
	professionalPortfolioApi.updateCertificate,
);
const mockUpdateBio = vi.mocked(professionalProfileApi.updateBio);
const mockUpdateSocialLinks = vi.mocked(
	professionalProfileApi.updateSocialLinks,
);
const mockUpdateCouncil = vi.mocked(professionalProfileApi.updateCouncil);
const mockUpdateAddress = vi.mocked(professionalProfileApi.updateAddress);
const mockGetRatings = vi.mocked(professionalsListingApi.getRatings);

const professional = { id: "prof-1", name: "Dr. João" };

function wrapper(useSuspense = false) {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			useSuspense
				? createElement(Suspense, { fallback: null }, children)
				: children,
		);
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

describe("useUpdateCertificate", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalPortfolioApi.updateCertificate com id e dados", async () => {
		const data = { name: "Cardiologia Avançada", issuer: "SBC", year: 2020 };
		mockUpdateCertificate.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateCertificate(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ certificateId: "cert-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateCertificate).toHaveBeenCalledWith("cert-1", data);
	});
});

describe("useUpdateBio", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalProfileApi.updateBio com os dados corretos", async () => {
		const data = {
			bio: "Especialista em cardiologia com 10 anos de experiência.",
		};
		mockUpdateBio.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateBio(), { wrapper: wrapper() });
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateBio).toHaveBeenCalledWith(data);
	});
});

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

describe("useUpdateAddress", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama professionalProfileApi.updateAddress com os dados corretos", async () => {
		const data = {
			street: "Rua A",
			city: "São Paulo",
			state: "SP",
			zipCode: "01000-000",
		};
		mockUpdateAddress.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateAddress(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateAddress).toHaveBeenCalledWith(data);
	});
});

describe("useProfessionalRatings", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as avaliações do profissional", async () => {
		const rating = { average: 4.5, total: 20 };
		mockGetRatings.mockResolvedValueOnce(rating as never);
		const { result } = renderHook(() => useProfessionalRatings("prof-1"), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual(rating);
		expect(mockGetRatings).toHaveBeenCalledWith("prof-1");
	});
});
