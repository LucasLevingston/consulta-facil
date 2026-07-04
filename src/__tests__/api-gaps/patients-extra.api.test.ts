import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { resetPasswordApi } from "@/lib/api/auth/reset-password.api";
import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const document = {
	id: "doc-1",
	documentType: "RG" as const,
	documentLabel: "RG frente",
	fileUrl: "https://s3.com/doc.pdf",
	fileName: "rg.pdf",
	uploadedAt: "2026-05-01T00:00:00Z",
};

const emergencyContact = {
	id: "contact-1",
	name: "Joana Silva",
	phone: "11988887777",
	email: "joana@test.com",
	relationship: "SPOUSE" as const,
};

const vaccine = {
	id: "vac-1",
	vaccineName: "Gripe",
	doseNumber: "1",
	administeredAt: "2026-04-01",
	notes: "Sem reações",
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

	describe("listDocuments — propagação de erro", () => {
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
});

describe("patientEmergencyContactsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("listEmergencyContacts", () => {
		it("chama GET /patients/me/emergency-contacts e retorna a lista", async () => {
			mockGet.mockResolvedValueOnce({ data: [emergencyContact] });

			const result = await patientEmergencyContactsApi.listEmergencyContacts();

			expect(mockGet).toHaveBeenCalledWith("/patients/me/emergency-contacts");
			expect(result).toEqual([emergencyContact]);
		});
	});

	describe("addEmergencyContact", () => {
		it("chama POST /patients/me/emergency-contacts com os dados e retorna o contato criado", async () => {
			mockPost.mockResolvedValueOnce({ data: emergencyContact });

			const result = await patientEmergencyContactsApi.addEmergencyContact({
				name: "Joana Silva",
				phone: "11988887777",
				email: "joana@test.com",
				relationship: "SPOUSE",
			});

			expect(mockPost).toHaveBeenCalledWith("/patients/me/emergency-contacts", {
				name: "Joana Silva",
				phone: "11988887777",
				email: "joana@test.com",
				relationship: "SPOUSE",
			});
			expect(result).toEqual(emergencyContact);
		});
	});

	describe("updateEmergencyContact", () => {
		it("chama PUT /patients/me/emergency-contacts/:id com os dados e retorna o contato atualizado", async () => {
			const updated = { ...emergencyContact, name: "Joana Souza" };
			mockPut.mockResolvedValueOnce({ data: updated });

			const result = await patientEmergencyContactsApi.updateEmergencyContact(
				"contact-1",
				{ ...emergencyContact, name: "Joana Souza" },
			);

			expect(mockPut).toHaveBeenCalledWith(
				"/patients/me/emergency-contacts/contact-1",
				{ ...emergencyContact, name: "Joana Souza" },
			);
			expect(result.name).toBe("Joana Souza");
		});
	});

	describe("deleteEmergencyContact", () => {
		it("chama DELETE /patients/me/emergency-contacts/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await patientEmergencyContactsApi.deleteEmergencyContact("contact-1");

			expect(mockDelete).toHaveBeenCalledWith(
				"/patients/me/emergency-contacts/contact-1",
			);
		});
	});

	describe("listEmergencyContacts — propagação de erro", () => {
		it("propaga erro 404 quando o recurso não existe", async () => {
			const error = Object.assign(new Error("Not Found"), {
				response: { status: 404 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(
				patientEmergencyContactsApi.listEmergencyContacts(),
			).rejects.toThrow("Not Found");
		});
	});
});

describe("patientVaccinesApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("listVaccines", () => {
		it("chama GET /patients/me/vaccines e retorna a lista de vacinas", async () => {
			mockGet.mockResolvedValueOnce({ data: [vaccine] });

			const result = await patientVaccinesApi.listVaccines();

			expect(mockGet).toHaveBeenCalledWith("/patients/me/vaccines");
			expect(result).toEqual([vaccine]);
		});

		it("retorna lista vazia quando o paciente não possui vacinas", async () => {
			mockGet.mockResolvedValueOnce({ data: [] });

			const result = await patientVaccinesApi.listVaccines();

			expect(result).toEqual([]);
		});
	});

	describe("addVaccine", () => {
		it("chama POST /patients/me/vaccines com os dados e retorna a vacina criada", async () => {
			mockPost.mockResolvedValueOnce({ data: vaccine });

			const result = await patientVaccinesApi.addVaccine({
				vaccineName: "Gripe",
				doseNumber: "1",
				administeredAt: "2026-04-01",
				notes: "Sem reações",
			});

			expect(mockPost).toHaveBeenCalledWith("/patients/me/vaccines", {
				vaccineName: "Gripe",
				doseNumber: "1",
				administeredAt: "2026-04-01",
				notes: "Sem reações",
			});
			expect(result).toEqual(vaccine);
		});
	});

	describe("deleteVaccine", () => {
		it("chama DELETE /patients/me/vaccines/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await patientVaccinesApi.deleteVaccine("vac-1");

			expect(mockDelete).toHaveBeenCalledWith("/patients/me/vaccines/vac-1");
		});
	});

	describe("addVaccine — propagação de erro", () => {
		it("propaga erro 500 quando o backend falha ao salvar", async () => {
			const error = Object.assign(new Error("Internal Server Error"), {
				response: { status: 500 },
			});
			mockPost.mockRejectedValueOnce(error);

			await expect(
				patientVaccinesApi.addVaccine({ vaccineName: "Febre Amarela" }),
			).rejects.toThrow("Internal Server Error");
		});
	});
});

describe("resetPasswordApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /auth/reset-password com token e nova senha", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await resetPasswordApi("token-abc", "novaSenha123");

		expect(mockPost).toHaveBeenCalledWith("/auth/reset-password", {
			token: "token-abc",
			newPassword: "novaSenha123",
		});
	});

	it("propaga erro quando o token é inválido ou expirado", async () => {
		const error = Object.assign(new Error("Bad Request"), {
			response: { status: 400 },
		});
		mockPost.mockRejectedValueOnce(error);

		await expect(
			resetPasswordApi("token-expirado", "novaSenha123"),
		).rejects.toThrow("Bad Request");
	});
});
