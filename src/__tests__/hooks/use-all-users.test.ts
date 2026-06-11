import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/users.api", () => ({
	usersApi: { getAll: vi.fn() },
}));

import { useAllUsers } from "@/hooks/api/users/use-all-users";
import { usersApi } from "@/lib/api/users.api";

const mockGetAll = vi.mocked(usersApi.getAll);

const user = {
	id: "u-1",
	name: "João Silva",
	email: "joao@email.com",
	role: "PATIENT" as const,
	createdAt: "2026-01-01T00:00:00Z",
};

const page = { content: [user], totalElements: 1, totalPages: 1, number: 0 };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAllUsers", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca com valores padrão page=0 size=20", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);

		const { result } = renderHook(() => useAllUsers(), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetAll).toHaveBeenCalledWith(0, 20, undefined);
		expect(result.current.data?.content).toHaveLength(1);
	});

	it("busca com filtro de role", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);

		const { result } = renderHook(() => useAllUsers(0, 20, "PROFESSIONAL"), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetAll).toHaveBeenCalledWith(0, 20, "PROFESSIONAL");
	});

	it("sem role filter passa undefined", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);

		renderHook(() => useAllUsers(0, 20, undefined), { wrapper: wrapper() });

		await waitFor(() => expect(mockGetAll).toHaveBeenCalled());
		expect(mockGetAll).toHaveBeenCalledWith(0, 20, undefined);
	});

	it("expõe totalElements corretamente", async () => {
		const bigPage = { ...page, totalElements: 150 };
		mockGetAll.mockResolvedValueOnce(bigPage as never);

		const { result } = renderHook(() => useAllUsers(0, 20), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.totalElements).toBe(150);
	});

	it("propaga erro da API", async () => {
		mockGetAll.mockRejectedValueOnce(new Error("Forbidden"));

		const { result } = renderHook(() => useAllUsers(), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isError).toBe(true));
	});
});
