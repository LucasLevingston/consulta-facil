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
import { useSaveProntuario } from "./use-save-prontuario";

const mockSaveProntuario = vi.mocked(anamnesisApi.saveProntuario);

const prontuario = { appointmentId: "a-1", clinicalNotes: "Pressão normal" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useSaveProntuario", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls saveProntuario with appointmentId and data", async () => {
		mockSaveProntuario.mockResolvedValueOnce(prontuario as never);
		const { result } = renderHook(() => useSaveProntuario("a-1"), {
			wrapper: wrapper(),
		});
		const data = { clinicalNotes: "Paciente com pressão alta" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSaveProntuario).toHaveBeenCalledWith("a-1", data);
	});
});
