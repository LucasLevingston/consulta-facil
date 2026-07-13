import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalSettingsApi } from "./professional-settings.api";

const mockPut = vi.mocked(api.put);

// ── setConsultationPrice ──────────────────────────────────────────────────────

describe("professionalSettingsApi — setConsultationPrice", () => {
	beforeEach(() => vi.clearAllMocks());

	it("envia o preço correto no payload", async () => {
		mockPut.mockResolvedValueOnce({ data: {} });

		await professionalSettingsApi.setConsultationPrice(350);

		expect(mockPut).toHaveBeenCalledWith(
			"/professionals/me/consultation-price",
			{ price: 350 },
		);
	});

	it("aceita diferentes valores de preço", async () => {
		mockPut.mockResolvedValueOnce({ data: {} });

		await professionalSettingsApi.setConsultationPrice(150.5);

		const [, payload] = mockPut.mock.calls[0];
		expect((payload as Record<string, unknown>).price).toBe(150.5);
	});
});
