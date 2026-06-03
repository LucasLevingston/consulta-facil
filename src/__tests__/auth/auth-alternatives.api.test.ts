import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { forgotPasswordApi } from "@/lib/api/auth/forgot-password.api";
import { googleLoginApi } from "@/lib/api/auth/google-login.api";
import { magicLinkRequestApi } from "@/lib/api/auth/magic-link-request.api";
import { magicLinkVerifyApi } from "@/lib/api/auth/magic-link-verify.api";

const mockPost = vi.mocked(api.post);
const mockGet = vi.mocked(api.get);

const loginResponse = {
	token: "jwt-token-abc123",
	type: "Bearer",
	expiresIn: 86400,
	userId: "u-1",
	email: "user@test.com",
	role: "PATIENT" as const,
};

// ── forgotPasswordApi ─────────────────────────────────────────────────────────

describe("forgotPasswordApi — reset de senha por e-mail", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /auth/forgot-password com e-mail correto", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await forgotPasswordApi("user@test.com");

		expect(mockPost).toHaveBeenCalledWith("/auth/forgot-password", {
			email: "user@test.com",
		});
	});

	it("e-mails diferentes produzem payloads diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: undefined })
			.mockResolvedValueOnce({ data: undefined });

		await forgotPasswordApi("a@test.com");
		await forgotPasswordApi("b@test.com");

		expect((mockPost.mock.calls[0][1] as Record<string, string>).email).toBe(
			"a@test.com",
		);
		expect((mockPost.mock.calls[1][1] as Record<string, string>).email).toBe(
			"b@test.com",
		);
	});

	it("não retorna dado (void)", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		const result = await forgotPasswordApi("user@test.com");

		expect(result).toBeUndefined();
	});
});

// ── googleLoginApi ────────────────────────────────────────────────────────────

describe("googleLoginApi — login via OAuth Google", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /auth/google com idToken correto", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });

		await googleLoginApi("google-id-token-xyz");

		expect(mockPost).toHaveBeenCalledWith("/auth/google", {
			idToken: "google-id-token-xyz",
		});
	});

	it("tokens diferentes produzem payloads diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: loginResponse })
			.mockResolvedValueOnce({ data: { ...loginResponse, token: "jwt-2" } });

		await googleLoginApi("token-1");
		await googleLoginApi("token-2");

		expect((mockPost.mock.calls[0][1] as Record<string, string>).idToken).toBe(
			"token-1",
		);
		expect((mockPost.mock.calls[1][1] as Record<string, string>).idToken).toBe(
			"token-2",
		);
	});

	it("retorna token JWT e dados do usuário", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });

		const result = await googleLoginApi("google-id-token-xyz");

		expect(result.token).toBe("jwt-token-abc123");
		expect(result.email).toBe("user@test.com");
	});

	it("retorna role do usuário autenticado", async () => {
		const profResponse = { ...loginResponse, role: "PROFESSIONAL" as const };
		mockPost.mockResolvedValueOnce({ data: profResponse });

		const result = await googleLoginApi("google-id-token-prof");

		expect(result.role).toBe("PROFESSIONAL");
	});
});

// ── magicLinkRequestApi ───────────────────────────────────────────────────────

describe("magicLinkRequestApi — solicitação de link mágico", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /auth/magic-link com e-mail correto", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await magicLinkRequestApi("user@test.com");

		expect(mockPost).toHaveBeenCalledWith("/auth/magic-link", {
			email: "user@test.com",
		});
	});

	it("e-mails diferentes produzem payloads diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: undefined })
			.mockResolvedValueOnce({ data: undefined });

		await magicLinkRequestApi("a@test.com");
		await magicLinkRequestApi("b@test.com");

		expect((mockPost.mock.calls[0][1] as Record<string, string>).email).toBe(
			"a@test.com",
		);
		expect((mockPost.mock.calls[1][1] as Record<string, string>).email).toBe(
			"b@test.com",
		);
	});

	it("não retorna dado (void)", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		const result = await magicLinkRequestApi("user@test.com");

		expect(result).toBeUndefined();
	});
});

// ── magicLinkVerifyApi ────────────────────────────────────────────────────────

describe("magicLinkVerifyApi — verificação do token de link mágico", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /auth/magic-link/verify com token como query param", async () => {
		mockGet.mockResolvedValueOnce({ data: loginResponse });

		await magicLinkVerifyApi("magic-token-abc");

		expect(mockGet).toHaveBeenCalledWith(
			"/auth/magic-link/verify",
			expect.objectContaining({ params: { token: "magic-token-abc" } }),
		);
	});

	it("tokens diferentes produzem params diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: loginResponse })
			.mockResolvedValueOnce({ data: { ...loginResponse, token: "jwt-2" } });

		await magicLinkVerifyApi("token-1");
		await magicLinkVerifyApi("token-2");

		const params0 = (
			mockGet.mock.calls[0][1] as { params: Record<string, string> }
		).params;
		const params1 = (
			mockGet.mock.calls[1][1] as { params: Record<string, string> }
		).params;
		expect(params0.token).toBe("token-1");
		expect(params1.token).toBe("token-2");
	});

	it("retorna token JWT e dados do usuário após verificação", async () => {
		mockGet.mockResolvedValueOnce({ data: loginResponse });

		const result = await magicLinkVerifyApi("magic-token-abc");

		expect(result.token).toBe("jwt-token-abc123");
		expect(result.email).toBe("user@test.com");
	});

	it("usa GET (não POST) — token via query string, não body", async () => {
		mockGet.mockResolvedValueOnce({ data: loginResponse });

		await magicLinkVerifyApi("magic-token-abc");

		expect(mockGet).toHaveBeenCalledTimes(1);
		expect(mockPost).not.toHaveBeenCalled();
	});
});
