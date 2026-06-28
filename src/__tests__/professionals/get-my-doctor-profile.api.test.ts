import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn() },
}));

import { api } from "@/config/api";
import { getMyProfessionalProfileApi } from "@/lib/api/professionals/my-professional-profile.api";

const mockGet = vi.mocked(api.get);

const profile = {
	id: "prof-1",
	userId: "u-1",
	specialty: "Cardiologia",
	licenseNumber: "CRM-SP-12345",
	status: "ACTIVE",
};

describe("getMyProfessionalProfileApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /professionals/me e retorna o perfil", async () => {
		mockGet.mockResolvedValueOnce({ data: profile });

		const result = await getMyProfessionalProfileApi();

		expect(mockGet).toHaveBeenCalledWith("/professionals/me");
		expect(result.id).toBe("prof-1");
		expect(result.specialty).toBe("Cardiologia");
	});

	it("retorna licenseNumber e status do perfil", async () => {
		mockGet.mockResolvedValueOnce({ data: profile });

		const result = await getMyProfessionalProfileApi();

		expect(result.licenseNumber).toBe("CRM-SP-12345");
		expect(result.status).toBe("ACTIVE");
	});

	it("propaga erro quando profissional não tem perfil cadastrado (404)", async () => {
		const error = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGet.mockRejectedValueOnce(error);

		await expect(getMyProfessionalProfileApi()).rejects.toThrow("Not Found");
		expect(mockGet).toHaveBeenCalledWith("/professionals/me");
	});

	it("propaga erro quando token não tem permissão (403)", async () => {
		const error = Object.assign(new Error("Forbidden"), {
			response: { status: 403 },
		});
		mockGet.mockRejectedValueOnce(error);

		await expect(getMyProfessionalProfileApi()).rejects.toThrow("Forbidden");
	});

	it("propaga erro quando não autenticado (401)", async () => {
		const error = Object.assign(new Error("Unauthorized"), {
			response: { status: 401 },
		});
		mockGet.mockRejectedValueOnce(error);

		await expect(getMyProfessionalProfileApi()).rejects.toThrow("Unauthorized");
	});
});
