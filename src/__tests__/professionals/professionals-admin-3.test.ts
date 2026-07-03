import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockGet = vi.mocked(api.get);

const professional = {
	id: "prof-1",
	userId: "u-1",
	name: "Dr. Carlos",
	specialty: "Cardiologia",
	licenseNumber: "CRM/SP 100001",
	status: "PENDING_REVIEW",
};

describe("professionalsApi — getNearby filtros de localização", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa lat, lng e radiusKm para a API", async () => {
		mockGet.mockResolvedValueOnce({ data: [professional] });

		const result = await professionalsListingApi.getNearby(-23.5, -46.6, 30);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/nearby",
			expect.objectContaining({
				params: expect.objectContaining({
					lat: -23.5,
					lng: -46.6,
					radiusKm: 30,
				}),
			}),
		);
		expect(result).toHaveLength(1);
	});

	it("filtra por specialty e passa corretamente", async () => {
		mockGet.mockResolvedValueOnce({ data: [professional] });

		await professionalsListingApi.getNearby(-23.5, -46.6, 50, "Cardiologia");

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.specialty).toBe("Cardiologia");
	});

	it("filtra por profession e passa corretamente", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		await professionalsListingApi.getNearby(
			-23.5,
			-46.6,
			50,
			undefined,
			"Médico",
		);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.profession).toBe("Médico");
	});

	it("combina specialty + profession em filtro simultâneo", async () => {
		mockGet.mockResolvedValueOnce({ data: [professional] });

		await professionalsListingApi.getNearby(
			-7.1,
			-34.8,
			20,
			"Pediatria",
			"Médico",
		);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.specialty).toBe("Pediatria");
		expect(params.profession).toBe("Médico");
		expect(params.lat).toBe(-7.1);
		expect(params.lng).toBe(-34.8);
		expect(params.radiusKm).toBe(20);
	});
});
