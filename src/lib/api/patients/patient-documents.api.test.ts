import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { patientDocumentsApi } from "./patient-documents.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockDelete = vi.mocked(api.delete);

const document = {
	id: "doc-1",
	documentType: "RG" as const,
	documentLabel: "RG frente",
	fileUrl: "https://s3.com/doc.pdf",
	fileName: "rg.pdf",
	uploadedAt: "2026-05-01T00:00:00Z",
};

describe("patientDocumentsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("listDocuments", () => {
		it("chama GET /patients/me/documents e retorna a lista de documentos", async () => {
			mockGet.mockResolvedValueOnce({ data: [document] });

			const result = await patientDocumentsApi.listDocuments();

			expect(mockGet).toHaveBeenCalledWith("/patients/me/documents");
			expect(result).toEqual([document]);
		});

		it("propaga erro 401 quando não autenticado", async () => {
			const error = Object.assign(new Error("Unauthorized"), {
				response: { status: 401 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(patientDocumentsApi.listDocuments()).rejects.toThrow(
				"Unauthorized",
			);
		});
	});

	describe("uploadDocument", () => {
		it("chama POST /patients/me/documents com FormData contendo arquivo, tipo e label", async () => {
			mockPost.mockResolvedValueOnce({ data: document });
			const file = new File(["conteudo"], "rg.pdf", {
				type: "application/pdf",
			});

			const result = await patientDocumentsApi.uploadDocument(
				file,
				"RG",
				"RG frente",
			);

			expect(mockPost).toHaveBeenCalledWith(
				"/patients/me/documents",
				expect.any(FormData),
				{ headers: { "Content-Type": "multipart/form-data" } },
			);
			const sentForm = mockPost.mock.calls[0][1] as FormData;
			expect(sentForm.get("file")).toBe(file);
			expect(sentForm.get("documentType")).toBe("RG");
			expect(sentForm.get("documentLabel")).toBe("RG frente");
			expect(result).toEqual(document);
		});

		it("não anexa documentLabel ao FormData quando não informado", async () => {
			mockPost.mockResolvedValueOnce({ data: document });
			const file = new File(["conteudo"], "cpf.pdf");

			await patientDocumentsApi.uploadDocument(file, "CPF");

			const sentForm = mockPost.mock.calls[0][1] as FormData;
			expect(sentForm.get("documentLabel")).toBeNull();
		});
	});

	describe("deleteDocument", () => {
		it("chama DELETE /patients/me/documents/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await patientDocumentsApi.deleteDocument("doc-1");

			expect(mockDelete).toHaveBeenCalledWith("/patients/me/documents/doc-1");
		});
	});
});
