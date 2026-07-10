import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "@/components/custom/error-boundary/error-boundary";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/users/users.api", () => ({
	usersApi: { getAll: vi.fn() },
}));

import { usersApi } from "@/lib/api/users/users.api";
import { useAllUsers } from "./use-all-users";

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
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useAllUsers", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca com valores padrão page=0 size=20", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);

		const { result } = renderHook(() => useAllUsers(), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current).not.toBeNull());
		expect(mockGetAll).toHaveBeenCalledWith(0, 20, undefined);
		expect(result.current.data.content).toHaveLength(1);
	});

	it("busca com filtro de role", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);

		const { result } = renderHook(() => useAllUsers(0, 20, "PROFESSIONAL"), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current).not.toBeNull());
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

		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data.totalElements).toBe(150);
	});

	it("propaga erro da API para o ErrorBoundary", async () => {
		mockGetAll.mockRejectedValueOnce(new Error("Forbidden"));
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		let caught: Error | null = null;
		const qc = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		const wrapperWithBoundary = ({ children }: { children: React.ReactNode }) =>
			createElement(
				QueryClientProvider,
				{ client: qc },
				createElement(
					ErrorBoundary,
					{
						fallbackRender: ({ error }: { error: Error }) => {
							caught = error;
							return null;
						},
					},
					createElement(Suspense, { fallback: null }, children),
				),
			);

		renderHook(() => useAllUsers(), { wrapper: wrapperWithBoundary });

		await waitFor(() => expect(caught).not.toBeNull());
		expect((caught as unknown as Error).message).toBe("Forbidden");

		spy.mockRestore();
	});
});
