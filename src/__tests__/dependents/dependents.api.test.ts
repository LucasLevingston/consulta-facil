import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { dependentsApi } from "@/lib/api/dependents/dependents.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

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
