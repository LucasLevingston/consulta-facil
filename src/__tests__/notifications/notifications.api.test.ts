import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { notificationsApi } from "@/lib/api/notifications.api";

const mockGet = vi.mocked(api.get);
const mockPut = vi.mocked(api.put);
const mockPost = vi.mocked(api.post);

const notification = {
	id: "notif-1",
	type: "CLINIC_INVITE" as const,
	title: "Convite para clínica",
	message: "Convite para clínica recebido",
	status: "PENDING" as const,
	createdAt: "2026-01-01T10:00:00",
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe("notificationsApi — getAll lista completa", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama endpoint correto", async () => {
		mockGet.mockResolvedValueOnce({ data: [notification] });

		await notificationsApi.getAll();

		expect(mockGet).toHaveBeenCalledWith("/notifications/me");
	});

	it("retorna todas as notificações do usuário", async () => {
		const notifs = [
			notification,
			{ ...notification, id: "notif-2", status: "READ" as const },
		];
		mockGet.mockResolvedValueOnce({ data: notifs });

		const result = await notificationsApi.getAll();

		expect(result).toHaveLength(2);
	});

	it("retorna array vazio quando não há notificações", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await notificationsApi.getAll();

		expect(result).toEqual([]);
	});

	it("distingue notificações lidas (READ) e não lidas (PENDING)", async () => {
		const notifs = [
			notification,
			{ ...notification, id: "notif-2", status: "READ" as const },
			{ ...notification, id: "notif-3", status: "READ" as const },
		];
		mockGet.mockResolvedValueOnce({ data: notifs });

		const result = await notificationsApi.getAll();

		const unread = result.filter((n) => n.status !== "READ");
		const read = result.filter((n) => n.status === "READ");
		expect(unread).toHaveLength(1);
		expect(read).toHaveLength(2);
	});

	it("retorna diferentes tipos de notificação", async () => {
		const notifs = [
			notification,
			{
				...notification,
				id: "notif-2",
				type: "APPOINTMENT_SCHEDULED" as const,
			},
			{ ...notification, id: "notif-3", type: "GENERAL" as const },
		];
		mockGet.mockResolvedValueOnce({ data: notifs });

		const result = await notificationsApi.getAll();

		const types = result.map((n) => n.type);
		expect(types).toContain("CLINIC_INVITE");
		expect(types).toContain("APPOINTMENT_SCHEDULED");
		expect(types).toContain("GENERAL");
	});
});

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

// ── markAllAsRead ─────────────────────────────────────────────────────────────

describe("notificationsApi — markAllAsRead", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT no endpoint correto", async () => {
		mockPut.mockResolvedValueOnce({ data: undefined });

		await notificationsApi.markAllAsRead();

		expect(mockPut).toHaveBeenCalledWith("/notifications/read-all");
	});
});

// ── acceptInvite / declineInvite ──────────────────────────────────────────────

describe("notificationsApi — acceptInvite e declineInvite", () => {
	beforeEach(() => vi.clearAllMocks());

	it("acceptInvite chama PUT no ID correto e retorna status ACCEPTED", async () => {
		const accepted = { ...notification, status: "ACCEPTED" as const };
		mockPut.mockResolvedValueOnce({ data: accepted });

		const result = await notificationsApi.acceptInvite("notif-1");

		expect(mockPut).toHaveBeenCalledWith("/notifications/notif-1/accept");
		expect(result.status).toBe("ACCEPTED");
	});

	it("declineInvite chama PUT no ID correto e retorna status DECLINED", async () => {
		const declined = { ...notification, status: "DECLINED" as const };
		mockPut.mockResolvedValueOnce({ data: declined });

		const result = await notificationsApi.declineInvite("notif-1");

		expect(mockPut).toHaveBeenCalledWith("/notifications/notif-1/decline");
		expect(result.status).toBe("DECLINED");
	});
});

// ── sendClinicInvite ──────────────────────────────────────────────────────────

describe("notificationsApi — sendClinicInvite", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST com clinicId e professionalProfileId corretos", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await notificationsApi.sendClinicInvite("clinic-1", "prof-1");

		expect(mockPost).toHaveBeenCalledWith("/clinics/clinic-1/invites/prof-1");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: undefined })
			.mockResolvedValueOnce({ data: undefined });

		await notificationsApi.sendClinicInvite("clinic-1", "prof-1");
		await notificationsApi.sendClinicInvite("clinic-2", "prof-2");

		expect(mockPost.mock.calls[0][0]).toBe("/clinics/clinic-1/invites/prof-1");
		expect(mockPost.mock.calls[1][0]).toBe("/clinics/clinic-2/invites/prof-2");
	});
});
