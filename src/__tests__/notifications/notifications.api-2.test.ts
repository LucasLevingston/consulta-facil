import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { notificationsApi } from "@/lib/api/notifications/notifications.api";

const mockGet = vi.mocked(api.get);
const mockPut = vi.mocked(api.put);

const notification = {
	id: "notif-1",
	type: "CLINIC_INVITE" as const,
	title: "Convite para clínica",
	message: "Convite para clínica recebido",
	status: "PENDING" as const,
	createdAt: "2026-01-01T10:00:00",
};

// ── getUnreadCount ────────────────────────────────────────────────────────────

describe("notificationsApi — getUnreadCount", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama endpoint correto e retorna contagem", async () => {
		mockGet.mockResolvedValueOnce({ data: { count: 5 } });

		const result = await notificationsApi.getUnreadCount();

		expect(mockGet).toHaveBeenCalledWith("/notifications/me/unread-count");
		expect(result).toBe(5);
	});

	it("retorna 0 quando todas as notificações estão lidas", async () => {
		mockGet.mockResolvedValueOnce({ data: { count: 0 } });

		const result = await notificationsApi.getUnreadCount();

		expect(result).toBe(0);
	});

	it("retorna contagem correta para múltiplas não lidas", async () => {
		mockGet.mockResolvedValueOnce({ data: { count: 12 } });

		const result = await notificationsApi.getUnreadCount();

		expect(result).toBe(12);
	});
});

// ── markAsRead ────────────────────────────────────────────────────────────────

describe("notificationsApi — markAsRead", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT no ID correto e retorna notificação atualizada", async () => {
		const updated = { ...notification, status: "READ" as const };
		mockPut.mockResolvedValueOnce({ data: updated });

		const result = await notificationsApi.markAsRead("notif-1");

		expect(mockPut).toHaveBeenCalledWith("/notifications/notif-1/read");
		expect(result.status).toBe("READ");
	});

	it("IDs diferentes produzem chamadas diferentes", async () => {
		mockPut
			.mockResolvedValueOnce({
				data: { ...notification, status: "READ" as const },
			})
			.mockResolvedValueOnce({
				data: { ...notification, id: "notif-2", status: "READ" as const },
			});

		await notificationsApi.markAsRead("notif-1");
		await notificationsApi.markAsRead("notif-2");

		expect(mockPut.mock.calls[0][0]).toBe("/notifications/notif-1/read");
		expect(mockPut.mock.calls[1][0]).toBe("/notifications/notif-2/read");
	});
});
