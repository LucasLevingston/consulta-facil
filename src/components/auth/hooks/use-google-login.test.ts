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
import { useGoogleLogin } from "./use-google-login";

const mockGoogleLogin = vi.mocked(authRepository.googleLogin);

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

describe("useGoogleLogin", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: null, isAuthenticated: false });
	});

	it("chama authRepository.googleLogin com o idToken", async () => {
		mockGoogleLogin.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useGoogleLogin(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("google-id-token");
		});
		expect(mockGoogleLogin).toHaveBeenCalledWith("google-id-token");
	});

	it("seta o auth store e o cookie ao ter sucesso", async () => {
		mockGoogleLogin.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useGoogleLogin(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("google-id-token");
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
		expect(Cookies.set).toHaveBeenCalledWith(
			"auth_token",
			"jwt-token",
			expect.objectContaining({ expires: 1 }),
		);
	});
});
