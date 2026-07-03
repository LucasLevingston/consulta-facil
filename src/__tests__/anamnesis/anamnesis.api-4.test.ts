import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { anamnesisApi } from "@/lib/api/anamnesis/anamnesis.api";

const mockPut = vi.mocked(api.put);

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
