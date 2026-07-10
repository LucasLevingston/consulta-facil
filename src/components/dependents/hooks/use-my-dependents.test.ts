import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/dependents/repositories/dependents.repository", () => ({
	dependentsRepository: {
		getMy: vi.fn().mockResolvedValue([]),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
	},
}));

import { useMyDependents } from "./use-my-dependents";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useMyDependents", () => {
	beforeEach(() => vi.clearAllMocks());

	it("resolves with data", async () => {
		const { result } = renderHook(() => useMyDependents(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});
});
