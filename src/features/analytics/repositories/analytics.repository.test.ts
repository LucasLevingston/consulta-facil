import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn().mockResolvedValue({ data: {} }),
	},
}));

import { analyticsRepository } from "./analytics.repository";

describe("analyticsRepository", () => {
	beforeEach(() => vi.clearAllMocks());

	it("getFinancial resolves with data", async () => {
		await expect(analyticsRepository.getFinancial()).resolves.toBeDefined();
	});

	it("getUsers resolves with data", async () => {
		await expect(analyticsRepository.getUsers()).resolves.toBeDefined();
	});

	it("getAppointments resolves with data", async () => {
		await expect(analyticsRepository.getAppointments()).resolves.toBeDefined();
	});

	it("getReferrals resolves with data", async () => {
		await expect(analyticsRepository.getReferrals()).resolves.toBeDefined();
	});

	it("getSubscriptions resolves with data", async () => {
		await expect(analyticsRepository.getSubscriptions()).resolves.toBeDefined();
	});
});
