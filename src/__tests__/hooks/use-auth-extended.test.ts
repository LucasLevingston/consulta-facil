import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/auth/forgot-password.api", () => ({
	forgotPasswordApi: vi.fn(),
}));
vi.mock("@/lib/api/auth/magic-link-request.api", () => ({
	magicLinkRequestApi: vi.fn(),
}));
vi.mock("@/lib/api/auth/magic-link-verify.api", () => ({
	magicLinkVerifyApi: vi.fn(),
}));
vi.mock("@/lib/api/auth/google-login.api", () => ({
	googleLoginApi: vi.fn(),
}));
vi.mock("@/store/auth.store", () => ({
	useAuthStore: vi.fn(() => vi.fn()),
}));
vi.mock("js-cookie", () => ({
	default: { set: vi.fn(), get: vi.fn(), remove: vi.fn() },
}));

import { useForgotPassword } from "@/hooks/api/auth/use-forgot-password";
import { useGoogleLogin } from "@/hooks/api/auth/use-google-login";
import { useMagicLinkRequest } from "@/hooks/api/auth/use-magic-link-request";
import { useMagicLinkVerify } from "@/hooks/api/auth/use-magic-link-verify";
import { forgotPasswordApi } from "@/lib/api/auth/forgot-password.api";
import { googleLoginApi } from "@/lib/api/auth/google-login.api";
import { magicLinkRequestApi } from "@/lib/api/auth/magic-link-request.api";
import { magicLinkVerifyApi } from "@/lib/api/auth/magic-link-verify.api";

const mockForgotPassword = vi.mocked(forgotPasswordApi);
const mockMagicLinkRequest = vi.mocked(magicLinkRequestApi);
const mockMagicLinkVerify = vi.mocked(magicLinkVerifyApi);
const mockGoogleLogin = vi.mocked(googleLoginApi);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useForgotPassword", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls forgotPasswordApi with email", async () => {
		mockForgotPassword.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useForgotPassword(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("user@example.com");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockForgotPassword).toHaveBeenCalledWith("user@example.com");
	});
});

describe("useMagicLinkRequest", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls magicLinkRequestApi with email", async () => {
		mockMagicLinkRequest.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useMagicLinkRequest(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("user@example.com");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockMagicLinkRequest).toHaveBeenCalledWith("user@example.com");
	});
});

describe("useMagicLinkVerify", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls magicLinkVerifyApi with token", async () => {
		mockMagicLinkVerify.mockResolvedValueOnce({ token: "jwt-abc" } as never);
		const { result } = renderHook(() => useMagicLinkVerify(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("magic-token-123");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockMagicLinkVerify).toHaveBeenCalledWith("magic-token-123");
	});
});

describe("useGoogleLogin", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls googleLoginApi with idToken", async () => {
		mockGoogleLogin.mockResolvedValueOnce({
			token: "jwt-abc",
			expiresIn: 86400,
		} as never);
		const { result } = renderHook(() => useGoogleLogin(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("google-id-token-xyz");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGoogleLogin).toHaveBeenCalledWith("google-id-token-xyz");
	});
});
