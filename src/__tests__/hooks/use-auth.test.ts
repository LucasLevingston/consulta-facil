import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { headers: { common: {} } },
		interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
	},
}));
vi.mock("@/lib/api/auth.api", () => ({
	authApi: { login: vi.fn(), register: vi.fn() },
}));
vi.mock("js-cookie", () => ({
	default: { set: vi.fn(), remove: vi.fn(), get: vi.fn() },
}));

import { useLogin, useRegister } from "@/hooks/api/use-auth";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

const mockLogin = vi.mocked(authApi.login);
const mockRegister = vi.mocked(authApi.register);

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
		localStorage.clear();
		useAuthStore.setState({ token: null, isAuthenticated: false });
	});

	it("calls authApi.login with credentials", async () => {
		mockLogin.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync({
				email: "user@email.com",
				password: "pass123",
			});
		});
		expect(mockLogin).toHaveBeenCalledWith({
			email: "user@email.com",
			password: "pass123",
		});
	});

	it("sets auth on success", async () => {
		mockLogin.mockResolvedValueOnce(loginResponse as never);
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync({
				email: "user@email.com",
				password: "pass123",
			});
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
	});

	it("isIdle initially", () => {
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		expect(result.current.status).toBe("idle");
	});
});

describe("useRegister", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls authApi.register", async () => {
		mockRegister.mockResolvedValueOnce({ id: "u-1" } as never);
		const { result } = renderHook(() => useRegister(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync({
				name: "João",
				email: "joao@email.com",
				password: "pass123",
				cpf: "12345678901",
				phone: "11999999999",
				birthDate: "1990-01-01",
				gender: "MALE",
			});
		});
		expect(mockRegister).toHaveBeenCalled();
	});
});
