import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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
import { useResetPassword } from "./use-reset-password";

const mockResetPassword = vi.mocked(authRepository.resetPassword);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

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
