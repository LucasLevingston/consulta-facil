import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

vi.mock("@/config/api", () => ({
	api: {
		post: vi.fn(),
		get: vi.fn(),
		defaults: { headers: { common: {} } },
	},
}));

vi.mock("js-cookie", () => ({
	default: { set: vi.fn(), remove: vi.fn() },
}));

import { api } from "@/config/api";

const mockPost = vi.mocked(api.post);

describe("useAuthStore", () => {
	beforeEach(() => {
		localStorage.clear();
		useAuthStore.setState({
			token: null,
			isAuthenticated: false,
			isLoading: false,
		});
		useUserStore.setState({ user: null, token: null, isLoading: false });
		vi.clearAllMocks();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("initial state: not authenticated when no token in localStorage", () => {
		const { token, isAuthenticated } = useAuthStore.getState();
		expect(token).toBeNull();
		expect(isAuthenticated).toBe(false);
	});

	it("setAuth sets token and isAuthenticated true", () => {
		useAuthStore.getState().setAuth("my-jwt-token");
		const { token, isAuthenticated } = useAuthStore.getState();
		expect(token).toBe("my-jwt-token");
		expect(isAuthenticated).toBe(true);
	});

	it("setAuth persists token to localStorage", () => {
		useAuthStore.getState().setAuth("my-jwt-token");
		expect(localStorage.getItem("authToken")).toBe("my-jwt-token");
	});

	it("logout clears token and isAuthenticated", () => {
		useAuthStore.setState({ token: "t", isAuthenticated: true });
		useAuthStore.getState().logout();
		const { token, isAuthenticated } = useAuthStore.getState();
		expect(token).toBeNull();
		expect(isAuthenticated).toBe(false);
	});

	it("logout removes token from localStorage", () => {
		localStorage.setItem("authToken", "t");
		useAuthStore.getState().logout();
		expect(localStorage.getItem("authToken")).toBeNull();
	});

	it("login sets token and isAuthenticated on success", async () => {
		mockPost.mockResolvedValueOnce({ data: { token: "server-token" } });
		vi.spyOn(useUserStore.getState(), "loadUser").mockResolvedValueOnce(
			undefined,
		);

		await useAuthStore.getState().login("user@email.com", "pass123");

		expect(useAuthStore.getState().token).toBe("server-token");
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
	});

	it("login posts to /auth/login with credentials", async () => {
		mockPost.mockResolvedValueOnce({ data: { token: "t" } });
		vi.spyOn(useUserStore.getState(), "loadUser").mockResolvedValueOnce(
			undefined,
		);

		await useAuthStore.getState().login("user@email.com", "pass123");

		expect(mockPost).toHaveBeenCalledWith("/auth/login", {
			email: "user@email.com",
			password: "pass123",
		});
	});

	it("login sets isLoading false after completion", async () => {
		mockPost.mockResolvedValueOnce({ data: { token: "t" } });
		vi.spyOn(useUserStore.getState(), "loadUser").mockResolvedValueOnce(
			undefined,
		);

		await useAuthStore.getState().login("user@email.com", "pass123");

		expect(useAuthStore.getState().isLoading).toBe(false);
	});

	it("getToken returns current token", () => {
		useAuthStore.setState({ token: "abc" });
		expect(useAuthStore.getState().getToken()).toBe("abc");
	});
});
