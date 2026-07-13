import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalScheduleApi } from "./professional-schedule.api";

const mockGet = vi.mocked(api.get);
const mockPut = vi.mocked(api.put);

const scheduleItem = {
	id: "sch-1",
	dayOfWeek: "MONDAY",
	startTime: "08:00",
	endTime: "17:00",
	consultationDurationMinutes: 30,
	breakBetweenConsultationsMinutes: 10,
	isActive: true,
};

// ── getMySchedule ─────────────────────────────────────────────────────────────

describe("professionalScheduleApi — getMySchedule", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama endpoint correto", async () => {
		mockGet.mockResolvedValueOnce({ data: [scheduleItem] });

		await professionalScheduleApi.getMySchedule();

		expect(mockGet).toHaveBeenCalledWith("/professionals/me/schedule");
	});

	it("retorna todos os dias da semana configurados", async () => {
		const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
		const fullSchedule = days.map((d, i) => ({
			...scheduleItem,
			id: `sch-${i}`,
			dayOfWeek: d,
		}));
		mockGet.mockResolvedValueOnce({ data: fullSchedule });

		const result = await professionalScheduleApi.getMySchedule();

		expect(result).toHaveLength(5);
		expect(result.map((r) => r.dayOfWeek)).toEqual(days);
	});

	it("retorna array vazio quando profissional não configurou horários", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await professionalScheduleApi.getMySchedule();

		expect(result).toEqual([]);
	});

	it("cada item contém duração e intervalo", async () => {
		mockGet.mockResolvedValueOnce({ data: [scheduleItem] });

		const result = await professionalScheduleApi.getMySchedule();

		expect(result[0].consultationDurationMinutes).toBe(30);
		expect(result[0].breakBetweenConsultationsMinutes).toBe(10);
	});
});

// ── getScheduleByProfessional ─────────────────────────────────────────────────

describe("professionalScheduleApi — getScheduleByProfessional filtro por ID", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa professionalId correto na URL", async () => {
		mockGet.mockResolvedValueOnce({ data: [scheduleItem] });

		await professionalScheduleApi.getScheduleByProfessional("prof-1");

		expect(mockGet).toHaveBeenCalledWith("/professionals/prof-1/schedule");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: [scheduleItem] })
			.mockResolvedValueOnce({ data: [] });

		await professionalScheduleApi.getScheduleByProfessional("prof-1");
		await professionalScheduleApi.getScheduleByProfessional("prof-99");

		expect(mockGet.mock.calls[0][0]).toBe("/professionals/prof-1/schedule");
		expect(mockGet.mock.calls[1][0]).toBe("/professionals/prof-99/schedule");
	});

	it("retorna apenas dias ativos do profissional", async () => {
		const schedule = [
			scheduleItem,
			{ ...scheduleItem, id: "sch-2", dayOfWeek: "SATURDAY", isActive: false },
		];
		mockGet.mockResolvedValueOnce({ data: schedule });

		const result =
			await professionalScheduleApi.getScheduleByProfessional("prof-1");

		const active = result.filter((r) => r.isActive);
		expect(active).toHaveLength(1);
		expect(active[0].dayOfWeek).toBe("MONDAY");
	});

	it("profissional sem agenda retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result =
			await professionalScheduleApi.getScheduleByProfessional("prof-new");

		expect(result).toEqual([]);
	});
});

// ── saveMySchedule ────────────────────────────────────────────────────────────

describe("professionalScheduleApi — saveMySchedule", () => {
	beforeEach(() => vi.clearAllMocks());

	it("envia payload completo via PUT", async () => {
		const items = [
			{
				dayOfWeek: "MONDAY" as const,
				startTime: "08:00",
				endTime: "17:00",
				consultationDurationMinutes: 30,
				breakBetweenConsultationsMinutes: 10,
				isActive: true,
			},
		];
		mockPut.mockResolvedValueOnce({ data: [scheduleItem] });

		await professionalScheduleApi.saveMySchedule(items);

		expect(mockPut).toHaveBeenCalledWith("/professionals/me/schedule", items);
	});

	it("retorna agenda salva com todos os campos", async () => {
		mockPut.mockResolvedValueOnce({ data: [scheduleItem] });

		const result = await professionalScheduleApi.saveMySchedule([
			{
				dayOfWeek: "MONDAY",
				startTime: "08:00",
				endTime: "17:00",
				consultationDurationMinutes: 30,
				breakBetweenConsultationsMinutes: 10,
				isActive: true,
			},
		]);

		expect(result[0].dayOfWeek).toBe("MONDAY");
		expect(result[0].startTime).toBe("08:00");
	});
});
