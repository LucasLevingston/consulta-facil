import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import Cookies from "js-cookie";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { headers: { common: {} as Record<string, string> } },
	},
}));
vi.mock("js-cookie", () => ({
	default: { set: vi.fn(), remove: vi.fn() },
}));
vi.mock("@/features/auth/repositories/auth.repository", () => ({
	authRepository: {
		login: vi.fn(),
		googleLogin: vi.fn(),
		register: vi.fn(),
		forgotPassword: vi.fn(),
		resetPassword: vi.fn(),
		magicLinkRequest: vi.fn(),
		magicLinkVerify: vi.fn(),
	},
}));

import { authRepository } from "@/features/auth/repositories/auth.repository";
import { useAuthStore } from "@/store/auth.store";
import { useMagicLinkVerify } from "./use-magic-link-verify";

const mockMagicLinkVerify = vi.mocked(authRepository.magicLinkVerify);

const loginResponse = {
	token: "jwt-token",
	expiresIn: 86400,
	userId: "u-1",
	role: "PATIENT",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMagicLinkVerify", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: null, isAuthenticated: false });
	});

	it("chama authRepository.magicLinkVerify com o token", async () => {
		mockMagicLinkVerify.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useMagicLinkVerify(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("magic-token-123");
		});
		expect(mockMagicLinkVerify).toHaveBeenCalledWith("magic-token-123");
	});

	it("seta o auth store e o cookie ao ter sucesso", async () => {
		mockMagicLinkVerify.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useMagicLinkVerify(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("magic-token-123");
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
		expect(Cookies.set).toHaveBeenCalledWith(
			"auth_token",
			"jwt-token",
			expect.objectContaining({ expires: 1 }),
		);
	});
});
