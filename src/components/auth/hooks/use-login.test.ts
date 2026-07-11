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
import { useLogin } from "./use-login";

const mockLogin = vi.mocked(authRepository.login);

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

describe("useLogin", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: null, isAuthenticated: false });
	});

	it("chama authRepository.login com as credenciais", async () => {
		mockLogin.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync({
				email: "joao@teste.com",
				password: "senha123",
			});
		});
		expect(mockLogin).toHaveBeenCalledWith({
			email: "joao@teste.com",
			password: "senha123",
		});
	});

	it("seta o auth store e o cookie ao ter sucesso", async () => {
		mockLogin.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync({
				email: "joao@teste.com",
				password: "senha123",
			});
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
		expect(useAuthStore.getState().token).toBe("jwt-token");
		expect(Cookies.set).toHaveBeenCalledWith(
			"auth_token",
			"jwt-token",
			expect.objectContaining({ expires: 1 }),
		);
	});

	it("esta idle inicialmente", () => {
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		expect(result.current.status).toBe("idle");
	});
});
