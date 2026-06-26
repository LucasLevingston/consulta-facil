import { api } from "@/config/api";
import type {
	DocumentType,
	PatientDocumentResponse,
} from "@/lib/schemas/patient/patient-document.schema";

export const patientDocumentsApi = {
	listDocuments: async (): Promise<PatientDocumentResponse[]> => {
		const response = await api.get<PatientDocumentResponse[]>(
			"/patients/me/documents",
		);
		return response.data;
	},

	uploadDocument: async (
		file: File,
		documentType: DocumentType,
		documentLabel?: string,
	): Promise<PatientDocumentResponse> => {
		const form = new FormData();
		form.append("file", file);
		form.append("documentType", documentType);
		if (documentLabel) form.append("documentLabel", documentLabel);
		const response = await api.post<PatientDocumentResponse>(
			"/patients/me/documents",
			form,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
		return response.data;
	},

	deleteDocument: async (id: string): Promise<void> => {
		await api.delete(`/patients/me/documents/${id}`);
	},
};
