import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { usersApi } from "./users.api";

const mockGet = vi.mocked(api.get);

const user = {
	id: "u-1",
	name: "Lucas Silva",
	email: "lucas@example.com",
	role: "PATIENT",
	createdAt: "2026-01-01T00:00:00Z",
};

const page = {
	content: [user],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe("usersApi — getAll paginação e filtros", () => {
	beforeEach(() => vi.clearAllMocks());

	it("usa page 0 e size 20 por padrão", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		await usersApi.getAll();

		expect(mockGet).toHaveBeenCalledWith("/users", {
			params: { page: 0, size: 20, role: undefined },
		});
	});

	it("passa page e size customizados", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		await usersApi.getAll(2, 50);

		expect(mockGet).toHaveBeenCalledWith("/users", {
			params: { page: 2, size: 50, role: undefined },
		});
	});

	it("passa role quando fornecido", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		await usersApi.getAll(0, 20, "PROFESSIONAL");

		expect(mockGet).toHaveBeenCalledWith("/users", {
			params: { page: 0, size: 20, role: "PROFESSIONAL" },
		});
	});

	it("omite role quando string vazia (usa undefined)", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		await usersApi.getAll(0, 20, "");

		const call = mockGet.mock.calls[0][1] as {
			params: Record<string, unknown>;
		};
		expect(call.params.role).toBeUndefined();
	});

	it("retorna página com content e metadados", async () => {
		const multiPage = {
			content: [user, { ...user, id: "u-2", name: "Maria" }],
			totalElements: 42,
			totalPages: 3,
			number: 0,
		};
		mockGet.mockResolvedValueOnce({ data: multiPage });

		const result = await usersApi.getAll();

		expect(result.content).toHaveLength(2);
		expect(result.totalElements).toBe(42);
		expect(result.totalPages).toBe(3);
	});

	it("retorna página vazia quando sem usuários", async () => {
		mockGet.mockResolvedValueOnce({
			data: { content: [], totalElements: 0, totalPages: 0, number: 0 },
		});

		const result = await usersApi.getAll();

		expect(result.content).toEqual([]);
		expect(result.totalElements).toBe(0);
	});

	it("filtra por role ADMIN corretamente", async () => {
		const adminPage = { ...page, content: [{ ...user, role: "ADMIN" }] };
		mockGet.mockResolvedValueOnce({ data: adminPage });

		const result = await usersApi.getAll(0, 20, "ADMIN");

		expect(mockGet).toHaveBeenCalledWith("/users", {
			params: { page: 0, size: 20, role: "ADMIN" },
		});
		expect(result.content[0].role).toBe("ADMIN");
	});
});

// ── updateNotificationPreferences ─────────────────────────────────────────────

describe("usersApi — updateNotificationPreferences", () => {
	beforeEach(() => vi.clearAllMocks());

	it("faz PATCH em /users/me/notification-preferences com o corpo e retorna o usuário", async () => {
		const mockPatch = vi.fn().mockResolvedValueOnce({
			data: { ...user, whatsappNotificationsEnabled: false },
		});
		(api as unknown as { patch: typeof mockPatch }).patch = mockPatch;

		const result = await usersApi.updateNotificationPreferences({
			whatsappNotificationsEnabled: false,
		});

		expect(mockPatch).toHaveBeenCalledWith(
			"/users/me/notification-preferences",
			{
				whatsappNotificationsEnabled: false,
			},
		);
		expect(result.whatsappNotificationsEnabled).toBe(false);
	});

	it("propaga erros da API", async () => {
		const mockPatch = vi.fn().mockRejectedValueOnce(new Error("401"));
		(api as unknown as { patch: typeof mockPatch }).patch = mockPatch;

		await expect(
			usersApi.updateNotificationPreferences({
				whatsappNotificationsEnabled: true,
			}),
		).rejects.toThrow("401");
	});
});
