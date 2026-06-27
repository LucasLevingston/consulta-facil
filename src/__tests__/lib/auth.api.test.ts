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

import { api } from "@/config/api";
import { loginApi } from "@/lib/api/auth/login.api";
import { registerApi } from "@/lib/api/auth/register.api";

const mockPost = vi.mocked(api.post);

const loginResponse = {
	token: "jwt-token",
	expiresIn: 86400,
	userId: "u-1",
	role: "PATIENT",
};
const userResponse = {
	id: "u-1",
	name: "João",
	email: "j@e.com",
	role: "PATIENT",
};

describe("loginApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("posts to /auth/login with credentials", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });
		await loginApi({ email: "j@e.com", password: "pass123" });
		expect(mockPost).toHaveBeenCalledWith("/auth/login", {
			email: "j@e.com",
			password: "pass123",
		});
	});

	it("returns LoginResponse", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });
		const result = await loginApi({
			email: "j@e.com",
			password: "pass123",
		});
		expect(result.token).toBe("jwt-token");
		expect(result.userId).toBe("u-1");
	});
});

describe("registerApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("posts to /auth/register with user data", async () => {
		mockPost.mockResolvedValueOnce({ data: userResponse });
		await registerApi({
			name: "João",
			email: "j@e.com",
			password: "pass123",
			cpf: "12345678901",
			phone: "11999999999",
			birthDate: "1990-01-01",
			gender: "MALE",
		});
		expect(mockPost).toHaveBeenCalledWith(
			"/auth/register",
			expect.objectContaining({ email: "j@e.com" }),
		);
	});

	it("returns UserResponse", async () => {
		mockPost.mockResolvedValueOnce({ data: userResponse });
		const result = await registerApi({
			name: "João",
			email: "j@e.com",
			password: "pass123",
			cpf: "12345678901",
			phone: "11999999999",
			birthDate: "1990-01-01",
			gender: "MALE",
		});
		expect(result.id).toBe("u-1");
	});
});
