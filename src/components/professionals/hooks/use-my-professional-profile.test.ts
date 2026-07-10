import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/my-professional-profile.api", () => ({
	getMyProfessionalProfileApi: vi.fn(),
}));

import { getMyProfessionalProfileApi } from "@/lib/api/professionals/my-professional-profile.api";
import { useMyProfessionalProfile } from "./use-my-professional-profile";

const mockGetMyProfile = vi.mocked(getMyProfessionalProfileApi);

const professional = {
	id: "prof-1",
	name: "Dr. Silva",
	specialty: "Cardiologia",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyProfessionalProfile", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when enabled=false", () => {
		const { result } = renderHook(() => useMyProfessionalProfile(false), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when enabled", async () => {
		mockGetMyProfile.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useMyProfessionalProfile(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(professional);
	});

	it("404 → isError=true, data=undefined (profissional sem perfil cadastrado)", async () => {
		const err404 = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGetMyProfile.mockRejectedValueOnce(err404);

		const { result } = renderHook(() => useMyProfessionalProfile(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeTruthy();
	});

	it("retry:false garante apenas 1 chamada quando 404", async () => {
		const err404 = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGetMyProfile.mockRejectedValue(err404);

		const { result } = renderHook(() => useMyProfessionalProfile(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(mockGetMyProfile).toHaveBeenCalledTimes(1);
	});

	it("não chama a API quando enabled=false (cenário: usuário ADMIN sem perfil)", () => {
		const { result } = renderHook(() => useMyProfessionalProfile(false), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
		expect(mockGetMyProfile).not.toHaveBeenCalled();
	});
});
