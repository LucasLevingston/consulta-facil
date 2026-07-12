import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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
import { useSaveAnamnesis } from "./use-save-anamnesis";

const mockSaveAnamnesis = vi.mocked(anamnesisApi.saveAnamnesis);

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

describe("useSaveAnamnesis", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls saveAnamnesis with appointmentId and data", async () => {
		mockSaveAnamnesis.mockResolvedValueOnce(anamnesis as never);
		const { result } = renderHook(() => useSaveAnamnesis("a-1"), {
			wrapper: wrapper(),
		});
		const data = { symptoms: "Febre", startDate: "2026-06-01" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSaveAnamnesis).toHaveBeenCalledWith("a-1", data);
	});
});
