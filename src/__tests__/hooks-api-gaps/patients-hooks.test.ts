import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-emergency-contacts.api", () => ({
	patientEmergencyContactsApi: {
		addEmergencyContact: vi.fn(),
		updateEmergencyContact: vi.fn(),
		deleteEmergencyContact: vi.fn(),
	},
}));
vi.mock("@/lib/api/patients/patient-vaccines.api", () => ({
	patientVaccinesApi: {
		addVaccine: vi.fn(),
		deleteVaccine: vi.fn(),
	},
}));
vi.mock("@/lib/api/patients/patient-documents.api", () => ({
	patientDocumentsApi: {
		uploadDocument: vi.fn(),
		deleteDocument: vi.fn(),
	},
}));

import { useAddEmergencyContact } from "@/features/patients/hooks/use-add-emergency-contact";
import { useAddVaccine } from "@/features/patients/hooks/use-add-vaccine";
import { useDeleteDocument } from "@/features/patients/hooks/use-delete-document";
import { useDeleteEmergencyContact } from "@/features/patients/hooks/use-delete-emergency-contact";
import { useDeleteVaccine } from "@/features/patients/hooks/use-delete-vaccine";
import { useUpdateEmergencyContact } from "@/features/patients/hooks/use-update-emergency-contact";
import { useUploadDocument } from "@/features/patients/hooks/use-upload-document";
import { patientDocumentsApi } from "@/lib/api/patients/patient-documents.api";
import { patientEmergencyContactsApi } from "@/lib/api/patients/patient-emergency-contacts.api";
import { patientVaccinesApi } from "@/lib/api/patients/patient-vaccines.api";

const mockAddEmergencyContact = vi.mocked(
	patientEmergencyContactsApi.addEmergencyContact,
);
const mockUpdateEmergencyContact = vi.mocked(
	patientEmergencyContactsApi.updateEmergencyContact,
);
const mockDeleteEmergencyContact = vi.mocked(
	patientEmergencyContactsApi.deleteEmergencyContact,
);
const mockAddVaccine = vi.mocked(patientVaccinesApi.addVaccine);
const mockDeleteVaccine = vi.mocked(patientVaccinesApi.deleteVaccine);
const mockUploadDocument = vi.mocked(patientDocumentsApi.uploadDocument);
const mockDeleteDocument = vi.mocked(patientDocumentsApi.deleteDocument);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAddEmergencyContact", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientEmergencyContactsApi.addEmergencyContact com os dados corretos", async () => {
		const contact = {
			name: "Maria",
			phone: "11999999999",
			relationship: "Mãe",
		};
		mockAddEmergencyContact.mockResolvedValueOnce(contact as never);
		const { result } = renderHook(() => useAddEmergencyContact(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(contact as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddEmergencyContact.mock.calls[0][0]).toEqual(contact);
	});
});

describe("useUpdateEmergencyContact", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientEmergencyContactsApi.updateEmergencyContact com id e dados", async () => {
		const data = {
			name: "Maria Souza",
			phone: "11988888888",
			relationship: "Mãe",
		};
		mockUpdateEmergencyContact.mockResolvedValueOnce(data as never);
		const { result } = renderHook(() => useUpdateEmergencyContact(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ id: "ec-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateEmergencyContact).toHaveBeenCalledWith("ec-1", data);
	});
});

describe("useDeleteEmergencyContact", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientEmergencyContactsApi.deleteEmergencyContact com o id", async () => {
		mockDeleteEmergencyContact.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteEmergencyContact(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("ec-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteEmergencyContact.mock.calls[0][0]).toBe("ec-1");
	});
});

describe("useAddVaccine", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientVaccinesApi.addVaccine com os dados corretos", async () => {
		const vaccine = { name: "Gripe", applicationDate: "2026-01-01" };
		mockAddVaccine.mockResolvedValueOnce(vaccine as never);
		const { result } = renderHook(() => useAddVaccine(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(vaccine as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddVaccine.mock.calls[0][0]).toEqual(vaccine);
	});
});

describe("useDeleteVaccine", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientVaccinesApi.deleteVaccine com o id", async () => {
		mockDeleteVaccine.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteVaccine(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("v-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteVaccine.mock.calls[0][0]).toBe("v-1");
	});
});

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

describe("useDeleteDocument", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama patientDocumentsApi.deleteDocument com o id", async () => {
		mockDeleteDocument.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteDocument(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("doc-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeleteDocument.mock.calls[0][0]).toBe("doc-1");
	});
});
