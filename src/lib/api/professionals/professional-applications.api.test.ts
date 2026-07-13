import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalApplicationsApi } from "./professional-applications.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
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

describe("professionalApplicationsApi — getPendingApplications pagination", () => {
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

// ── approve / reject ──────────────────────────────────────────────────────────

describe("professionalApplicationsApi — approve e reject", () => {
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

// ── create ─────────────────────────────────────────────────────────────────────

describe("professionalApplicationsApi — create", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /professionals e retorna o profissional criado", async () => {
		const created = {
			id: "d-1",
			name: "Dr. João",
			email: "joao@clinica.com",
			profession: "Médico",
			specialty: "Cardiologia",
			licenseNumber: "CRM-12345",
			phone: "11999990000",
		};
		mockPost.mockResolvedValueOnce({ data: created });

		const result = await professionalApplicationsApi.create({
			name: created.name,
			email: created.email,
			profession: created.profession,
			specialty: created.specialty,
			licenseNumber: created.licenseNumber,
			phone: created.phone,
		});

		expect(mockPost).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({ name: created.name }),
		);
		expect(result.id).toBe("d-1");
	});
});

// ── getApplicationStatus ────────────────────────────────────────────────────────

describe("professionalApplicationsApi — getApplicationStatus", () => {
	beforeEach(() => vi.clearAllMocks());

	const applicant = {
		id: "d-1",
		name: "Dr. João",
		email: "joao@clinica.com",
		profession: "Médico",
		specialty: "Cardiologia",
		licenseNumber: "CRM-12345",
		phone: "11999990000",
	};

	it("chama GET /professionals/application-status e retorna perfil", async () => {
		mockGet.mockResolvedValueOnce({ data: applicant });

		const result = await professionalApplicationsApi.getApplicationStatus();

		expect(mockGet).toHaveBeenCalledWith("/professionals/application-status");
		expect(result.id).toBe("d-1");
	});

	it("retorna status da candidatura do profissional autenticado", async () => {
		const pending = { ...applicant, status: "PENDING_REVIEW" };
		mockGet.mockResolvedValueOnce({ data: pending });

		const result = await professionalApplicationsApi.getApplicationStatus();

		expect(result.status).toBe("PENDING_REVIEW");
	});

	it("não requer parâmetros na chamada", async () => {
		mockGet.mockResolvedValueOnce({ data: applicant });

		await professionalApplicationsApi.getApplicationStatus();

		expect(mockGet).toHaveBeenCalledWith("/professionals/application-status");
		expect(mockGet).toHaveBeenCalledTimes(1);
	});
});
