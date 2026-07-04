import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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

import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import { useGoogleLogin } from "@/features/auth/hooks/use-google-login";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useMagicLinkRequest } from "@/features/auth/hooks/use-magic-link-request";
import { useMagicLinkVerify } from "@/features/auth/hooks/use-magic-link-verify";
import { useRegister } from "@/features/auth/hooks/use-register";
import { useResetPassword } from "@/features/auth/hooks/use-reset-password";
import { authRepository } from "@/features/auth/repositories/auth.repository";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

const mockLogin = vi.mocked(authRepository.login);
const mockGoogleLogin = vi.mocked(authRepository.googleLogin);
const mockRegister = vi.mocked(authRepository.register);
const mockForgotPassword = vi.mocked(authRepository.forgotPassword);
const mockResetPassword = vi.mocked(authRepository.resetPassword);
const mockMagicLinkRequest = vi.mocked(authRepository.magicLinkRequest);
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

describe("useMagicLinkRequest", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama authRepository.magicLinkRequest com o email", async () => {
		mockMagicLinkRequest.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useMagicLinkRequest(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("joao@teste.com");
		});
		expect(mockMagicLinkRequest).toHaveBeenCalledWith("joao@teste.com");
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});

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

describe("useRegister", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama authRepository.register com os dados informados", async () => {
		const registerData = {
			name: "Joao",
			email: "joao@teste.com",
			password: "senha123",
			cpf: "12345678900",
		};
		const userResponse = { id: "u-1", name: "Joao", email: "joao@teste.com" };
		mockRegister.mockResolvedValueOnce(userResponse as never);
		const { result } = renderHook(() => useRegister(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync(registerData as never);
		});
		expect(mockRegister).toHaveBeenCalledWith(registerData);
		await waitFor(() => expect(result.current.data).toEqual(userResponse));
	});
});

describe("useForgotPassword", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama authRepository.forgotPassword com o email", async () => {
		mockForgotPassword.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useForgotPassword(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("joao@teste.com");
		});
		expect(mockForgotPassword).toHaveBeenCalledWith("joao@teste.com");
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});

describe("useResetPassword", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama authRepository.resetPassword com token e nova senha", async () => {
		mockResetPassword.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useResetPassword(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync({
				token: "reset-token",
				newPassword: "novaSenha123",
			});
		});
		expect(mockResetPassword).toHaveBeenCalledWith(
			"reset-token",
			"novaSenha123",
		);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});

describe("useLogout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: "jwt-token", isAuthenticated: true });
		useUserStore.setState({
			user: { id: "u-1" } as never,
			token: "jwt-token",
		});
	});

	it("limpa auth store, user store e o cookie ao efetuar logout", () => {
		const { result } = renderHook(() => useLogout());
		act(() => {
			result.current();
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
		expect(useAuthStore.getState().token).toBeNull();
		expect(useUserStore.getState().user).toBeNull();
		expect(Cookies.remove).toHaveBeenCalledWith("auth_token");
	});
});
