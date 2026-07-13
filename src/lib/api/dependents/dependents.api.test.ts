import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { dependentsApi } from "./dependents.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const dependent = {
	id: "dep-1",
	name: "Ana Silva",
	dateOfBirth: "2018-03-15",
	relationship: "DAUGHTER",
	gender: "FEMALE",
};

const createInput = {
	name: "Ana Silva",
	dateOfBirth: "2018-03-15",
	relationship: "DAUGHTER",
	gender: "FEMALE",
};

// ── getMy ─────────────────────────────────────────────────────────────────────

describe("dependentsApi — getMy", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /users/me/dependents", async () => {
		mockGet.mockResolvedValueOnce({ data: [dependent] });

		await dependentsApi.getMy();

		expect(mockGet).toHaveBeenCalledWith("/users/me/dependents");
	});

	it("retorna lista de dependentes", async () => {
		mockGet.mockResolvedValueOnce({
			data: [dependent, { ...dependent, id: "dep-2", name: "Pedro" }],
		});

		const result = await dependentsApi.getMy();

		expect(result).toHaveLength(2);
		expect(result[0].id).toBe("dep-1");
	});

	it("retorna array vazio quando sem dependentes", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await dependentsApi.getMy();

		expect(result).toEqual([]);
	});
});

// ── create ────────────────────────────────────────────────────────────────────

describe("dependentsApi — create", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /users/me/dependents com payload", async () => {
		mockPost.mockResolvedValueOnce({ data: dependent });

		await dependentsApi.create(createInput as never);

		expect(mockPost).toHaveBeenCalledWith("/users/me/dependents", createInput);
	});

	it("retorna dependente criado com id", async () => {
		mockPost.mockResolvedValueOnce({ data: dependent });

		const result = await dependentsApi.create(createInput as never);

		expect(result.id).toBe("dep-1");
		expect(result.name).toBe("Ana Silva");
		expect(result.relationship).toBe("DAUGHTER");
	});

	it("diferentes payloads produzem chamadas diferentes", async () => {
		const second = { ...createInput, name: "Pedro", relationship: "SON" };
		mockPost.mockResolvedValueOnce({ data: dependent }).mockResolvedValueOnce({
			data: { ...dependent, id: "dep-2", name: "Pedro" },
		});

		await dependentsApi.create(createInput as never);
		await dependentsApi.create(second as never);

		expect(mockPost.mock.calls[0][1]).toEqual(createInput);
		expect(mockPost.mock.calls[1][1]).toEqual(second);
	});
});

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
