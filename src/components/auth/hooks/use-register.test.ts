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
import { useRegister } from "./use-register";

const mockRegister = vi.mocked(authRepository.register);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

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
