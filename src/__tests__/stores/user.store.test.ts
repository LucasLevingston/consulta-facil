import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore } from "@/store/useUserStore";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		defaults: { headers: { common: {} } },
	},
}));

import { api } from "@/config/api";

const mockGet = vi.mocked(api.get);

const mockUser = {
	id: "u-1",
	name: "João Silva",
	email: "joao@email.com",
	role: "PATIENT" as const,
	phone: "11999999999",
	cpf: "12345678901",
};

describe("useUserStore", () => {
	beforeEach(() => {
		localStorage.clear();
		useUserStore.setState({ user: null, token: null, isLoading: false });
		vi.clearAllMocks();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("initial state: user null, token null, isLoading false", () => {
		const state = useUserStore.getState();
		expect(state.user).toBeNull();
		expect(state.token).toBeNull();
		expect(state.isLoading).toBe(false);
	});

	it("loadUser without token sets user null", async () => {
		await useUserStore.getState().loadUser();
		expect(useUserStore.getState().user).toBeNull();
		expect(useUserStore.getState().token).toBeNull();
	});

	it("loadUser with token fetches and sets user", async () => {
		localStorage.setItem("authToken", "test-token");
		mockGet.mockResolvedValueOnce({ data: mockUser });

		await useUserStore.getState().loadUser();

		expect(mockGet).toHaveBeenCalledWith("/users/me");
		expect(useUserStore.getState().user).toEqual(mockUser);
		expect(useUserStore.getState().token).toBe("test-token");
	});

	it("loadUser 401 clears user and token", async () => {
		localStorage.setItem("authToken", "expired-token");
		mockGet.mockRejectedValueOnce({ response: { status: 401 } });

		await useUserStore.getState().loadUser();

		expect(useUserStore.getState().user).toBeNull();
		expect(useUserStore.getState().token).toBeNull();
	});

	it("clearUser removes user and token from state and localStorage", () => {
		localStorage.setItem("authToken", "test-token");
		useUserStore.setState({ user: mockUser as never, token: "test-token" });

		useUserStore.getState().clearUser();

		expect(useUserStore.getState().user).toBeNull();
		expect(useUserStore.getState().token).toBeNull();
		expect(localStorage.getItem("authToken")).toBeNull();
	});

	it("getToken returns current token", () => {
		useUserStore.setState({ token: "my-token" });
		expect(useUserStore.getState().getToken()).toBe("my-token");
	});

	it("getToken returns null when no token", () => {
		useUserStore.setState({ token: null });
		expect(useUserStore.getState().getToken()).toBeNull();
	});
});
