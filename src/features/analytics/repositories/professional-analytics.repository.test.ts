import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProfessionalAnalytics } from "@/__tests__/fixtures/professional-analytics.fixture";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalAnalyticsRepository } from "./professional-analytics.repository";

const mockGet = vi.mocked(api.get);

describe("professionalAnalyticsRepository.getMine", () => {
	beforeEach(() => vi.clearAllMocks());

	it("requests the logged professional's analytics for the period", async () => {
		const payload = makeProfessionalAnalytics({ period: "90d" });
		mockGet.mockResolvedValueOnce({ data: payload });

		const result = await professionalAnalyticsRepository.getMine("90d");

		expect(mockGet).toHaveBeenCalledWith("/professionals/me/analytics", {
			params: { period: "90d" },
		});
		expect(result).toEqual(payload);
	});

	it("propagates API errors (e.g. 403 for patients)", async () => {
		mockGet.mockRejectedValueOnce(
			new Error("Request failed with status code 403"),
		);

		await expect(
			professionalAnalyticsRepository.getMine("30d"),
		).rejects.toThrow("403");
	});
});
