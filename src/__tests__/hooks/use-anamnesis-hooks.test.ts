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

import { useAnamnesis } from "@/hooks/api/anamnesis/use-anamnesis";
import { useProntuario } from "@/hooks/api/anamnesis/use-prontuario";
import { useSaveAnamnesis } from "@/hooks/api/anamnesis/use-save-anamnesis";
import { useSaveProntuario } from "@/hooks/api/anamnesis/use-save-prontuario";
import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";

const mockGetAnamnesis = vi.mocked(anamnesisApi.getAnamnesis);
const mockGetProntuario = vi.mocked(anamnesisApi.getProntuario);
const mockSaveAnamnesis = vi.mocked(anamnesisApi.saveAnamnesis);
const mockSaveProntuario = vi.mocked(anamnesisApi.saveProntuario);

const anamnesis = {
	appointmentId: "a-1",
	symptoms: "Dor de cabeça",
	startDate: "2026-01-01",
};
const prontuario = { appointmentId: "a-1", clinicalNotes: "Pressão normal" };

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

describe("useProntuario", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when appointmentId empty", () => {
		const { result } = renderHook(() => useProntuario(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when appointmentId provided", async () => {
		mockGetProntuario.mockResolvedValueOnce(prontuario as never);
		const { result } = renderHook(() => useProntuario("a-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(prontuario);
	});
});

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
