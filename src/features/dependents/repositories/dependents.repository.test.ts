import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn().mockResolvedValue({ data: [] }),
		post: vi.fn().mockResolvedValue({ data: { id: "1" } }),
		put: vi.fn().mockResolvedValue({ data: { id: "1" } }),
		delete: vi.fn().mockResolvedValue({ data: undefined }),
	},
}));

import { dependentsRepository } from "./dependents.repository";

describe("dependentsRepository", () => {
	beforeEach(() => vi.clearAllMocks());

	it("getMy resolves with array", async () => {
		const result = await dependentsRepository.getMy();
		expect(Array.isArray(result)).toBe(true);
	});

	it("create resolves with object", async () => {
		const result = await dependentsRepository.create({
			name: "Test",
			birthDate: "2000-01-01",
			relationship: "son",
		} as never);
		expect(result).toBeDefined();
	});

	it("update resolves with object", async () => {
		const result = await dependentsRepository.update("id1", {
			name: "Updated",
		});
		expect(result).toBeDefined();
	});

	it("remove resolves without error", async () => {
		await expect(dependentsRepository.remove("id1")).resolves.not.toThrow();
	});
});
