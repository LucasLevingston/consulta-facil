import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { patientEmergencyContactsApi } from "./patient-emergency-contacts.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const emergencyContact = {
	id: "contact-1",
	name: "Joana Silva",
	phone: "11988887777",
	email: "joana@test.com",
	relationship: "SPOUSE" as const,
};

describe("patientEmergencyContactsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("listEmergencyContacts", () => {
		it("chama GET /patients/me/emergency-contacts e retorna a lista", async () => {
			mockGet.mockResolvedValueOnce({ data: [emergencyContact] });

			const result = await patientEmergencyContactsApi.listEmergencyContacts();

			expect(mockGet).toHaveBeenCalledWith("/patients/me/emergency-contacts");
			expect(result).toEqual([emergencyContact]);
		});

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
});
