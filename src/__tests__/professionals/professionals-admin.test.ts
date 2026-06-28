import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockGet = vi.mocked(api.get);
const mockPut = vi.mocked(api.put);

const professional = {
	id: "prof-1",
	userId: "u-1",
	name: "Dr. Carlos",
	specialty: "Cardiologia",
	licenseNumber: "CRM/SP 100001",
	status: "PENDING_REVIEW",
};

function makePage(
	content: (typeof professional)[],
	totalElements: number,
	totalPages: number,
	pageNumber: number,
	size = 20,
) {
	return {
		content,
		totalElements,
		totalPages,
		size,
		number: pageNumber,
		first: pageNumber === 0,
		last: pageNumber === totalPages - 1,
	};
}

// ── getPendingApplications ────────────────────────────────────────────────────

describe("professionalsApi — getPendingApplications pagination", () => {
	beforeEach(() => vi.clearAllMocks());

	it("primeira página retorna metadados corretos", async () => {
		const page = makePage([professional], 3, 1, 0);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalApplicationsApi.getPendingApplications(
			0,
			20,
		);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/applications",
			expect.objectContaining({
				params: expect.objectContaining({ page: 0, size: 20 }),
			}),
		);
		expect(result.totalElements).toBe(3);
		expect(result.totalPages).toBe(1);
		expect(result.number).toBe(0);
		expect(result.content).toHaveLength(1);
	});

	it("segunda página passa page=1 corretamente", async () => {
		const page = makePage([professional], 45, 3, 1);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalApplicationsApi.getPendingApplications(
			1,
			20,
		);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/applications",
			expect.objectContaining({ params: expect.objectContaining({ page: 1 }) }),
		);
		expect(result.number).toBe(1);
		expect(result.totalPages).toBe(3);
	});

	it("última página retorna last=true", async () => {
		const page = makePage([professional], 45, 3, 2);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalApplicationsApi.getPendingApplications(
			2,
			20,
		);

		expect(result.last).toBe(true);
		expect(result.number).toBe(2);
	});

	it("tamanho de página personalizado passa size correto", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0, 5) });

		await professionalApplicationsApi.getPendingApplications(0, 5);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/applications",
			expect.objectContaining({ params: expect.objectContaining({ size: 5 }) }),
		);
	});

	it("fila vazia retorna totalElements=0 e content vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		const result = await professionalApplicationsApi.getPendingApplications(
			0,
			20,
		);

		expect(result.totalElements).toBe(0);
		expect(result.totalPages).toBe(0);
		expect(result.content).toHaveLength(0);
	});

	it("navegação entre páginas mantém totalElements consistente", async () => {
		const totalElements = 60;
		mockGet
			.mockResolvedValueOnce({
				data: makePage([professional], totalElements, 3, 0),
			})
			.mockResolvedValueOnce({
				data: makePage([professional], totalElements, 3, 1),
			})
			.mockResolvedValueOnce({
				data: makePage([professional], totalElements, 3, 2),
			});

		const p0 = await professionalApplicationsApi.getPendingApplications(0, 20);
		const p1 = await professionalApplicationsApi.getPendingApplications(1, 20);
		const p2 = await professionalApplicationsApi.getPendingApplications(2, 20);

		expect(p0.totalElements).toBe(totalElements);
		expect(p1.totalElements).toBe(totalElements);
		expect(p2.totalElements).toBe(totalElements);
		expect(p0.first).toBe(true);
		expect(p2.last).toBe(true);
	});
});

// ── getNearby ─────────────────────────────────────────────────────────────────

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

	it("specialty undefined não envia parâmetro", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		await professionalsListingApi.getNearby(-23.5, -46.6, 50, undefined);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.specialty).toBeUndefined();
	});

	it("retorna array vazio quando nenhum profissional encontrado", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await professionalsListingApi.getNearby(-23.5, -46.6, 5);

		expect(result).toEqual([]);
	});

	it("retorna múltiplos profissionais dentro do raio", async () => {
		const profs = [professional, { ...professional, id: "prof-2" }];
		mockGet.mockResolvedValueOnce({ data: profs });

		const result = await professionalsListingApi.getNearby(-23.5, -46.6, 50);

		expect(result).toHaveLength(2);
	});
});

// ── approve / reject ──────────────────────────────────────────────────────────

describe("professionalsApi — approve e reject", () => {
	beforeEach(() => vi.clearAllMocks());

	it("approve chama PUT na URL correta", async () => {
		const approved = { ...professional, status: "ACTIVE" };
		mockPut.mockResolvedValueOnce({ data: approved });

		const result = await professionalApplicationsApi.approve("prof-1");

		expect(mockPut).toHaveBeenCalledWith("/professionals/prof-1/approve");
		expect(result.status).toBe("ACTIVE");
	});

	it("reject chama PUT na URL correta", async () => {
		const rejected = { ...professional, status: "REJECTED" };
		mockPut.mockResolvedValueOnce({ data: rejected });

		const result = await professionalApplicationsApi.reject("prof-1");

		expect(mockPut).toHaveBeenCalledWith("/professionals/prof-1/reject");
		expect(result.status).toBe("REJECTED");
	});
});
