import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";

const mockGet = vi.mocked(api.get);

const anamnesis = {
	id: "ana-1",
	appointmentId: "apt-1",
	chiefComplaint: "Dor no peito",
	currentMedications: "Atorvastatina 20mg",
	allergies: "Penicilina",
	medicalHistory: "HAS desde 2018",
	familyHistory: "Pai com DM2",
	observations: "Paciente ansioso",
	createdAt: "2026-01-01T10:00:00",
	updatedAt: "2026-01-01T10:00:00",
};

// ── getAnamnesis ──────────────────────────────────────────────────────────────

describe("anamnesisApi — getAnamnesis filtro por consulta", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa appointmentId correto na URL", async () => {
		mockGet.mockResolvedValueOnce({ status: 200, data: anamnesis });

		await anamnesisApi.getAnamnesis("apt-1");

		expect(mockGet).toHaveBeenCalledWith("/appointments/apt-1/anamnesis");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ status: 200, data: anamnesis })
			.mockResolvedValueOnce({ status: 200, data: anamnesis });

		await anamnesisApi.getAnamnesis("apt-1");
		await anamnesisApi.getAnamnesis("apt-2");

		expect(mockGet.mock.calls[0][0]).toBe("/appointments/apt-1/anamnesis");
		expect(mockGet.mock.calls[1][0]).toBe("/appointments/apt-2/anamnesis");
	});

	it("retorna dados da anamnese quando encontrada", async () => {
		mockGet.mockResolvedValueOnce({ status: 200, data: anamnesis });

		const result = await anamnesisApi.getAnamnesis("apt-1");

		expect(result).not.toBeNull();
		expect(result?.chiefComplaint).toBe("Dor no peito");
		expect(result?.allergies).toBe("Penicilina");
		expect(result?.appointmentId).toBe("apt-1");
	});

	it("retorna null quando status 204 (sem anamnese)", async () => {
		mockGet.mockResolvedValueOnce({ status: 204, data: undefined });

		const result = await anamnesisApi.getAnamnesis("apt-sem-anamnese");

		expect(result).toBeNull();
	});

	it("campos opcionais podem ser undefined", async () => {
		const minimal = {
			...anamnesis,
			currentMedications: undefined,
			allergies: undefined,
		};
		mockGet.mockResolvedValueOnce({ status: 200, data: minimal });

		const result = await anamnesisApi.getAnamnesis("apt-1");

		expect(result?.chiefComplaint).toBe("Dor no peito");
		expect(result?.currentMedications).toBeUndefined();
	});
});
