import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";

const mockGet = vi.mocked(api.get);
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

const prontuario = {
	id: "pro-1",
	appointmentId: "apt-1",
	clinicalNotes: "Paciente refere dor precordial",
	diagnosis: "Angina estável",
	diagnosisCid: "I20",
	prescription: "AAS 100mg 1x/dia",
	examRequests: "ECG, Troponina",
	treatmentPlan: "Otimização medicamentosa",
	followUpInstructions: "Retorno em 30 dias",
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

// ── getProntuario ─────────────────────────────────────────────────────────────

describe("anamnesisApi — getProntuario filtro por consulta", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa appointmentId correto na URL", async () => {
		mockGet.mockResolvedValueOnce({ status: 200, data: prontuario });

		await anamnesisApi.getProntuario("apt-1");

		expect(mockGet).toHaveBeenCalledWith("/appointments/apt-1/prontuario");
	});

	it("retorna prontuário com campos clínicos", async () => {
		mockGet.mockResolvedValueOnce({ status: 200, data: prontuario });

		const result = await anamnesisApi.getProntuario("apt-1");

		expect(result?.diagnosis).toBe("Angina estável");
		expect(result?.diagnosisCid).toBe("I20");
		expect(result?.prescription).toBe("AAS 100mg 1x/dia");
	});

	it("retorna null quando status 204", async () => {
		mockGet.mockResolvedValueOnce({ status: 204, data: undefined });

		const result = await anamnesisApi.getProntuario("apt-sem-prontuario");

		expect(result).toBeNull();
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ status: 200, data: prontuario })
			.mockResolvedValueOnce({ status: 204, data: undefined });

		await anamnesisApi.getProntuario("apt-1");
		await anamnesisApi.getProntuario("apt-2");

		expect(mockGet.mock.calls[0][0]).toBe("/appointments/apt-1/prontuario");
		expect(mockGet.mock.calls[1][0]).toBe("/appointments/apt-2/prontuario");
	});
});

// ── saveProntuario ────────────────────────────────────────────────────────────

describe("anamnesisApi — saveProntuario mutação por consulta", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT no appointmentId correto com payload", async () => {
		mockPut.mockResolvedValueOnce({ data: prontuario });

		const input = {
			diagnosis: "Angina estável",
			diagnosisCid: "I20",
			prescription: "AAS 100mg",
		};

		await anamnesisApi.saveProntuario("apt-1", input);

		expect(mockPut).toHaveBeenCalledWith(
			"/appointments/apt-1/prontuario",
			input,
		);
	});

	it("retorna prontuário salvo com id", async () => {
		mockPut.mockResolvedValueOnce({ data: prontuario });

		const result = await anamnesisApi.saveProntuario("apt-1", {
			clinicalNotes: "Paciente refere dor",
		});

		expect(result.id).toBe("pro-1");
		expect(result.appointmentId).toBe("apt-1");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPut.mockResolvedValueOnce({ data: prontuario }).mockResolvedValueOnce({
			data: { ...prontuario, appointmentId: "apt-2" },
		});

		await anamnesisApi.saveProntuario("apt-1", { diagnosis: "Angina" });
		await anamnesisApi.saveProntuario("apt-2", { diagnosis: "HAS" });

		expect(mockPut.mock.calls[0][0]).toBe("/appointments/apt-1/prontuario");
		expect(mockPut.mock.calls[1][0]).toBe("/appointments/apt-2/prontuario");
	});
});
