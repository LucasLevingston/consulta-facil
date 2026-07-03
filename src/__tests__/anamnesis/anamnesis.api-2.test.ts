import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";

const mockPut = vi.mocked(api.put);

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

// ── saveAnamnesis ─────────────────────────────────────────────────────────────

describe("anamnesisApi — saveAnamnesis mutação por consulta", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT no appointmentId correto com payload", async () => {
		mockPut.mockResolvedValueOnce({ data: anamnesis });

		const input = {
			chiefComplaint: "Dor no peito",
			allergies: "Penicilina",
		};

		await anamnesisApi.saveAnamnesis("apt-1", input);

		expect(mockPut).toHaveBeenCalledWith(
			"/appointments/apt-1/anamnesis",
			input,
		);
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPut.mockResolvedValueOnce({ data: anamnesis }).mockResolvedValueOnce({
			data: { ...anamnesis, appointmentId: "apt-2" },
		});

		await anamnesisApi.saveAnamnesis("apt-1", { chiefComplaint: "Dor" });
		await anamnesisApi.saveAnamnesis("apt-2", { chiefComplaint: "Febre" });

		expect(mockPut.mock.calls[0][0]).toBe("/appointments/apt-1/anamnesis");
		expect(mockPut.mock.calls[1][0]).toBe("/appointments/apt-2/anamnesis");
	});

	it("retorna anamnese salva com id", async () => {
		mockPut.mockResolvedValueOnce({ data: anamnesis });

		const result = await anamnesisApi.saveAnamnesis("apt-1", {
			chiefComplaint: "Dor no peito",
		});

		expect(result.id).toBe("ana-1");
		expect(result.appointmentId).toBe("apt-1");
	});

	it("payload completo enviado corretamente", async () => {
		mockPut.mockResolvedValueOnce({ data: anamnesis });

		const fullInput = {
			chiefComplaint: "Dor",
			currentMedications: "AAS",
			allergies: "Penicilina",
			medicalHistory: "HAS",
			familyHistory: "DM",
			observations: "Paciente calmo",
		};

		await anamnesisApi.saveAnamnesis("apt-1", fullInput);

		expect(mockPut).toHaveBeenCalledWith(
			"/appointments/apt-1/anamnesis",
			fullInput,
		);
	});
});
