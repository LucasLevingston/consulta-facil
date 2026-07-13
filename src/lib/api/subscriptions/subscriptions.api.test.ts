import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), patch: vi.fn() },
}));

import { api } from "@/config/api";
import { subscriptionsApi } from "./subscriptions.api";

const mockGet = vi.mocked(api.get);
const mockPatch = vi.mocked(api.patch);

const adminSubscription = {
	id: "sub-1",
	planId: "monthly",
	status: "ACTIVE" as const,
	expiresAt: "2027-05-01T00:00:00Z",
	createdAt: "2026-05-01T00:00:00Z",
	userId: "u-1",
	userEmail: "user@test.com",
	planName: "Mensal",
	ownerType: "PROFESSIONAL" as const,
};

describe("subscriptionsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("adminListAll", () => {
		it("chama GET /admin/subscriptions e retorna todas as assinaturas", async () => {
			mockGet.mockResolvedValueOnce({ data: [adminSubscription] });

			const result = await subscriptionsApi.adminListAll();

			expect(mockGet).toHaveBeenCalledWith("/admin/subscriptions");
			expect(result).toEqual([adminSubscription]);
		});

		it("propaga erro 403 quando o usuário não é admin", async () => {
			const error = Object.assign(new Error("Forbidden"), {
				response: { status: 403 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(subscriptionsApi.adminListAll()).rejects.toThrow(
				"Forbidden",
			);
		});
	});

	describe("adminCancel", () => {
		it("chama PATCH /admin/subscriptions/:id/cancel", async () => {
			mockPatch.mockResolvedValueOnce({ data: undefined });

			await subscriptionsApi.adminCancel("sub-1");

			expect(mockPatch).toHaveBeenCalledWith(
				"/admin/subscriptions/sub-1/cancel",
			);
		});
	});
});
