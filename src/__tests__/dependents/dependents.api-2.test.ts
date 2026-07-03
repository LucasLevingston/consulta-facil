import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { dependentsApi } from "@/lib/api/dependents/dependents.api";

const _mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const dependent = {
	id: "dep-1",
	name: "Ana Silva",
	dateOfBirth: "2018-03-15",
	relationship: "DAUGHTER",
	gender: "FEMALE",
};

// ── update ────────────────────────────────────────────────────────────────────

describe("dependentsApi — update", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT /dependents/:id com payload parcial", async () => {
		const updated = { ...dependent, name: "Ana Lima" };
		mockPut.mockResolvedValueOnce({ data: updated });

		await dependentsApi.update("dep-1", { name: "Ana Lima" });

		expect(mockPut).toHaveBeenCalledWith("/dependents/dep-1", {
			name: "Ana Lima",
		});
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPut
			.mockResolvedValueOnce({ data: dependent })
			.mockResolvedValueOnce({ data: { ...dependent, id: "dep-2" } });

		await dependentsApi.update("dep-1", { name: "Ana" });
		await dependentsApi.update("dep-2", { name: "Pedro" });

		expect(mockPut.mock.calls[0][0]).toBe("/dependents/dep-1");
		expect(mockPut.mock.calls[1][0]).toBe("/dependents/dep-2");
	});

	it("retorna dependente atualizado", async () => {
		const updated = { ...dependent, name: "Ana Lima" };
		mockPut.mockResolvedValueOnce({ data: updated });

		const result = await dependentsApi.update("dep-1", { name: "Ana Lima" });

		expect(result.name).toBe("Ana Lima");
		expect(result.id).toBe("dep-1");
	});
});

// ── remove ────────────────────────────────────────────────────────────────────

describe("dependentsApi — remove", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama DELETE /dependents/:id", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		await dependentsApi.remove("dep-1");

		expect(mockDelete).toHaveBeenCalledWith("/dependents/dep-1");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockDelete
			.mockResolvedValueOnce({ data: undefined })
			.mockResolvedValueOnce({ data: undefined });

		await dependentsApi.remove("dep-1");
		await dependentsApi.remove("dep-2");

		expect(mockDelete.mock.calls[0][0]).toBe("/dependents/dep-1");
		expect(mockDelete.mock.calls[1][0]).toBe("/dependents/dep-2");
	});

	it("não retorna dado (void)", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		const result = await dependentsApi.remove("dep-1");

		expect(result).toBeUndefined();
	});
});
