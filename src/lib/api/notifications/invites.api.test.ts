import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { invitesApi } from "./invites.api";

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

// ── acceptInvite / declineInvite ──────────────────────────────────────────────

describe("invitesApi — acceptInvite e declineInvite", () => {
	beforeEach(() => vi.clearAllMocks());

	it("acceptInvite chama PUT no ID correto e retorna status ACCEPTED", async () => {
		const accepted = { ...notification, status: "ACCEPTED" as const };
		mockPut.mockResolvedValueOnce({ data: accepted });

		const result = await invitesApi.acceptInvite("notif-1");

		expect(mockPut).toHaveBeenCalledWith("/notifications/notif-1/accept");
		expect(result.status).toBe("ACCEPTED");
	});

	it("declineInvite chama PUT no ID correto e retorna status DECLINED", async () => {
		const declined = { ...notification, status: "DECLINED" as const };
		mockPut.mockResolvedValueOnce({ data: declined });

		const result = await invitesApi.declineInvite("notif-1");

		expect(mockPut).toHaveBeenCalledWith("/notifications/notif-1/decline");
		expect(result.status).toBe("DECLINED");
	});
});

// ── sendClinicInvite ──────────────────────────────────────────────────────────

describe("invitesApi — sendClinicInvite", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST com clinicId e professionalProfileId corretos", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await invitesApi.sendClinicInvite("clinic-1", "prof-1");

		expect(mockPost).toHaveBeenCalledWith("/clinics/clinic-1/invites/prof-1");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: undefined })
			.mockResolvedValueOnce({ data: undefined });

		await invitesApi.sendClinicInvite("clinic-1", "prof-1");
		await invitesApi.sendClinicInvite("clinic-2", "prof-2");

		expect(mockPost.mock.calls[0][0]).toBe("/clinics/clinic-1/invites/prof-1");
		expect(mockPost.mock.calls[1][0]).toBe("/clinics/clinic-2/invites/prof-2");
	});
});
