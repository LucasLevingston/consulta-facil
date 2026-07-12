import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/anamnesis/anamnesis.api", () => ({
	anamnesisApi: {
		getAnamnesis: vi.fn(),
		getProntuario: vi.fn(),
		saveAnamnesis: vi.fn(),
		saveProntuario: vi.fn(),
	},
}));

import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";
import { useAnamnesis } from "./use-anamnesis";

const mockGetAnamnesis = vi.mocked(anamnesisApi.getAnamnesis);

const anamnesis = {
	appointmentId: "a-1",
	symptoms: "Dor de cabeça",
	startDate: "2026-01-01",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAnamnesis", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when appointmentId empty", () => {
		const { result } = renderHook(() => useAnamnesis(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when appointmentId provided", async () => {
		mockGetAnamnesis.mockResolvedValueOnce(anamnesis as never);
		const { result } = renderHook(() => useAnamnesis("a-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(anamnesis);
	});
});
