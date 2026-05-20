import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn() },
}));

import { api } from "@/config/api";
import { getMyDoctorProfileApi } from "@/lib/api/doctors/get-my-doctor-profile.api";

const mockGet = vi.mocked(api.get);

const doctorProfile = {
	id: "dp-1",
	userId: "u-1",
	name: "Dr. João Costa",
	specialty: "Cardiologia",
	licenseNumber: "CRM-SP-12345",
	email: "joao@example.com",
};

describe("getMyDoctorProfileApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /professionals/me e retorna o perfil do profissional autenticado", async () => {
		mockGet.mockResolvedValueOnce({ data: doctorProfile });

		const result = await getMyDoctorProfileApi();

		expect(mockGet).toHaveBeenCalledWith("/professionals/me");
		expect(result.specialty).toBe("Cardiologia");
		expect(result.licenseNumber).toBe("CRM-SP-12345");
	});

	it("propaga erro quando o usuário não é profissional", async () => {
		mockGet.mockRejectedValueOnce(new Error("Forbidden"));

		await expect(getMyDoctorProfileApi()).rejects.toThrow("Forbidden");
	});
});
