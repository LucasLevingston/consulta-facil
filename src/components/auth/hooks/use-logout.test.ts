import { act, renderHook } from "@testing-library/react";
import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("js-cookie", () => ({
	default: { set: vi.fn(), remove: vi.fn() },
}));

import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";
import { useLogout } from "./use-logout";

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
