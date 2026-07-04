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
		defaults: { headers: { common: {} } },
	},
}));
vi.mock("@/lib/api/clinics/clinics.api", () => ({
	clinicsCrudApi: { getMy: vi.fn() },
}));
vi.mock("@/lib/api/auth/reset-password.api", () => ({
	resetPasswordApi: vi.fn(),
}));
vi.mock("js-cookie", () => ({ default: { set: vi.fn(), remove: vi.fn() } }));

import Cookies from "js-cookie";

import { useLogout } from "@/hooks/api/auth/use-logout";
import { useResetPassword } from "@/hooks/api/auth/use-reset-password";
import { useMyClinic } from "@/hooks/api/clinics/use-my-clinic";
import { resetPasswordApi } from "@/lib/api/auth/reset-password.api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

const mockGetMy = vi.mocked(clinicsCrudApi.getMy);
const mockResetPasswordApi = vi.mocked(resetPasswordApi);
const mockCookiesRemove = vi.mocked(Cookies.remove);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyClinic", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca as clínicas do profissional autenticado", async () => {
		const clinics = [{ id: "clinic-1", name: "Clínica Central" }];
		mockGetMy.mockResolvedValueOnce(clinics as never);
		const { result } = renderHook(() => useMyClinic(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(clinics);
		expect(mockGetMy).toHaveBeenCalled();
	});
});

describe("useLogout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.setState({ token: "token-abc", isAuthenticated: true });
		useUserStore.setState({ user: { id: "u-1" } as never, token: "token-abc" });
	});

	it("limpa o estado de autenticação e remove o cookie ao deslogar", () => {
		const { result } = renderHook(() => useLogout());

		act(() => {
			result.current();
		});

		expect(useAuthStore.getState().isAuthenticated).toBe(false);
		expect(useAuthStore.getState().token).toBeNull();
		expect(useUserStore.getState().user).toBeNull();
		expect(mockCookiesRemove).toHaveBeenCalledWith("auth_token");
	});
});

describe("useResetPassword", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama resetPasswordApi com token e nova senha", async () => {
		mockResetPasswordApi.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useResetPassword(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({
				token: "reset-token",
				newPassword: "novaSenha123",
			} as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockResetPasswordApi).toHaveBeenCalledWith(
			"reset-token",
			"novaSenha123",
		);
	});
});
