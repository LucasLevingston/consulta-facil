import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), defaults: { headers: { common: {} } } },
}));
vi.mock("@/lib/api/auth/login.api", () => ({ loginApi: vi.fn() }));
vi.mock("@/lib/api/auth/google-login.api", () => ({ googleLoginApi: vi.fn() }));
vi.mock("@/lib/api/auth/magic-link-verify.api", () => ({
	magicLinkVerifyApi: vi.fn(),
}));
vi.mock("js-cookie", () => ({ default: { set: vi.fn(), remove: vi.fn() } }));

import { useGoogleLogin } from "@/hooks/api/auth/use-google-login";
import { useLogin } from "@/hooks/api/auth/use-login";
import { useMagicLinkVerify } from "@/hooks/api/auth/use-magic-link-verify";
import { googleLoginApi } from "@/lib/api/auth/google-login.api";
import { loginApi } from "@/lib/api/auth/login.api";
import { magicLinkVerifyApi } from "@/lib/api/auth/magic-link-verify.api";
import { useAuthStore } from "@/store/auth.store";

const mockLoginApi = vi.mocked(loginApi);
const mockGoogleApi = vi.mocked(googleLoginApi);
const mockMagicVerify = vi.mocked(magicLinkVerifyApi);
const loginRes = {
	token: "jwt",
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
	afterEach(() => localStorage.clear());

	it("calls loginApi with credentials", async () => {
		mockLoginApi.mockResolvedValueOnce(loginRes as never);
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync({ email: "j@e.com", password: "pass" });
		});
		expect(mockLoginApi).toHaveBeenCalledWith({
			email: "j@e.com",
			password: "pass",
		});
	});

	it("sets auth on success", async () => {
		mockLoginApi.mockResolvedValueOnce(loginRes as never);
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		await act(async () => {
			await result.current.mutateAsync({ email: "j@e.com", password: "pass" });
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
	});

	it("is idle initially", () => {
		const { result } = renderHook(() => useLogin(), { wrapper: wrapper() });
		expect(result.current.status).toBe("idle");
	});
});

describe("useGoogleLogin", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: null, isAuthenticated: false });
	});

	it("calls googleLoginApi with idToken", async () => {
		mockGoogleApi.mockResolvedValueOnce(loginRes as never);
		const { result } = renderHook(() => useGoogleLogin(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("google-id-token");
		});
		expect(mockGoogleApi).toHaveBeenCalledWith("google-id-token");
	});

	it("sets auth on success", async () => {
		mockGoogleApi.mockResolvedValueOnce(loginRes as never);
		const { result } = renderHook(() => useGoogleLogin(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("google-id-token");
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
	});
});

describe("useMagicLinkVerify", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: null, isAuthenticated: false });
	});

	it("calls magicLinkVerifyApi with token", async () => {
		mockMagicVerify.mockResolvedValueOnce(loginRes as never);
		const { result } = renderHook(() => useMagicLinkVerify(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("magic-token-123");
		});
		expect(mockMagicVerify).toHaveBeenCalledWith("magic-token-123");
	});

	it("sets auth on success", async () => {
		mockMagicVerify.mockResolvedValueOnce(loginRes as never);
		const { result } = renderHook(() => useMagicLinkVerify(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			await result.current.mutateAsync("magic-token-123");
		});
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
	});
});
