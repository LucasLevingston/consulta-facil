import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";

const mockGet = vi.mocked(api.get);

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
