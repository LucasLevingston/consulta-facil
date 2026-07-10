import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-documents.api", () => ({
	patientDocumentsApi: { listDocuments: vi.fn() },
}));

import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { usePatientDocuments } from "./use-patient-documents";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("usePatientDocuments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches documents list", async () => {
		vi.mocked(patientDocumentsApi.listDocuments).mockResolvedValueOnce([
			{ id: "doc-1", type: "EXAM" },
		] as never);
		const { result } = renderHook(() => usePatientDocuments(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});
