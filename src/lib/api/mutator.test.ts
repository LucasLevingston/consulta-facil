import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { request: vi.fn() },
}));

import { api } from "@/config/api";
import { customInstance } from "./mutator";

const mockRequest = vi.mocked(api.request);

describe("customInstance", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama api.request com o config original e retorna apenas os dados", async () => {
		mockRequest.mockResolvedValueOnce({ data: { id: "1", name: "Teste" } });

		const result = await customInstance<{ id: string; name: string }>({
			url: "/patients",
			method: "GET",
		});

		expect(mockRequest).toHaveBeenCalledWith({
			url: "/patients",
			method: "GET",
			signal: undefined,
		});
		expect(result).toEqual({ id: "1", name: "Teste" });
	});

	it("repassa o signal informado nas options para o axios", async () => {
		const controller = new AbortController();
		mockRequest.mockResolvedValueOnce({ data: [] });

		await customInstance(
			{ url: "/exam-labs", method: "GET" },
			{ signal: controller.signal },
		);

		expect(mockRequest).toHaveBeenCalledWith({
			url: "/exam-labs",
			method: "GET",
			signal: controller.signal,
		});
	});

	it("preserva demais campos do config (params, headers, data)", async () => {
		mockRequest.mockResolvedValueOnce({ data: { ok: true } });

		await customInstance({
			url: "/exam-schedulings",
			method: "POST",
			data: { examLabId: "lab-1" },
			headers: { "Content-Type": "application/json" },
			params: { foo: "bar" },
		});

		expect(mockRequest).toHaveBeenCalledWith({
			url: "/exam-schedulings",
			method: "POST",
			data: { examLabId: "lab-1" },
			headers: { "Content-Type": "application/json" },
			params: { foo: "bar" },
			signal: undefined,
		});
	});

	it("propaga o erro quando a requisição falha", async () => {
		const error = Object.assign(new Error("Network Error"), {
			response: { status: 500 },
		});
		mockRequest.mockRejectedValueOnce(error);

		await expect(
			customInstance({ url: "/patients", method: "GET" }),
		).rejects.toThrow("Network Error");
	});
});
