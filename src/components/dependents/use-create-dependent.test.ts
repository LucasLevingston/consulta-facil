import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/dependents/repositories/dependents.repository", () => ({
	dependentsRepository: {
		getMy: vi.fn(),
		create: vi.fn().mockResolvedValue({}),
		update: vi.fn(),
		remove: vi.fn(),
	},
}));

import { useCreateDependent } from "./use-create-dependent";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCreateDependent", () => {
	beforeEach(() => vi.clearAllMocks());

	it("returns mutate and isPending", () => {
		const { result } = renderHook(() => useCreateDependent(), {
			wrapper: wrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
