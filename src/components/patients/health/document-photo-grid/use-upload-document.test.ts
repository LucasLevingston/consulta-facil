import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-documents.api", () => ({
	patientDocumentsApi: {
		uploadDocument: vi.fn(),
		deleteDocument: vi.fn(),
	},
}));

import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { useUploadDocument } from "./use-upload-document";

const mockUploadDocument = vi.mocked(patientDocumentsApi.uploadDocument);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUploadDocument", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientDocumentsApi.uploadDocument com file, documentType e documentLabel", async () => {
		const doc = { id: "doc-1", documentType: "RG", documentLabel: "Frente" };
		mockUploadDocument.mockResolvedValueOnce(doc as never);
		const { result } = renderHook(() => useUploadDocument(), {
			wrapper: wrapper(),
		});
		const file = new File(["conteudo"], "rg.png", { type: "image/png" });
		await act(async () => {
			result.current.mutate({
				file,
				documentType: "RG",
				documentLabel: "Frente",
			} as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUploadDocument).toHaveBeenCalledWith(file, "RG", "Frente");
	});
});
