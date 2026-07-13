import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicWorkingHoursApi } from "./clinic-working-hours.api";

const mockGet = vi.mocked(api.get);

const workingHoursItem = {
	id: "wh-1",
	dayOfWeek: "MONDAY",
	openTime: "08:00",
	closeTime: "18:00",
	isOpen: true,
};

// ── getClinicWorkingHours ─────────────────────────────────────────────────────

describe("clinicWorkingHoursApi — getClinicWorkingHours filtro por clínica", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa clinicId correto na URL", async () => {
		mockGet.mockResolvedValueOnce({ data: [workingHoursItem] });

		await clinicWorkingHoursApi.getClinicWorkingHours("clinic-1");

		expect(mockGet).toHaveBeenCalledWith("/clinics/clinic-1/working-hours");
	});

	it("IDs de clínica diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: [workingHoursItem] })
			.mockResolvedValueOnce({ data: [] });

		await clinicWorkingHoursApi.getClinicWorkingHours("clinic-1");
		await clinicWorkingHoursApi.getClinicWorkingHours("clinic-2");

		expect(mockGet.mock.calls[0][0]).toBe("/clinics/clinic-1/working-hours");
		expect(mockGet.mock.calls[1][0]).toBe("/clinics/clinic-2/working-hours");
	});

	it("retorna horários de todos os dias configurados", async () => {
		const days = ["MONDAY", "TUESDAY", "WEDNESDAY"];
		const hours = days.map((d, i) => ({
			...workingHoursItem,
			id: `wh-${i}`,
			dayOfWeek: d,
		}));
		mockGet.mockResolvedValueOnce({ data: hours });

		const result =
			await clinicWorkingHoursApi.getClinicWorkingHours("clinic-1");

		expect(result).toHaveLength(3);
		expect(result.map((h) => h.dayOfWeek)).toEqual(days);
	});

	it("filtra apenas dias abertos", async () => {
		const hours = [
			workingHoursItem,
			{ ...workingHoursItem, id: "wh-2", dayOfWeek: "SUNDAY", isOpen: false },
		];
		mockGet.mockResolvedValueOnce({ data: hours });

		const result =
			await clinicWorkingHoursApi.getClinicWorkingHours("clinic-1");

		const open = result.filter((h) => h.isOpen);
		expect(open).toHaveLength(1);
		expect(open[0].dayOfWeek).toBe("MONDAY");
	});

	it("clínica sem horários configurados retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result =
			await clinicWorkingHoursApi.getClinicWorkingHours("clinic-new");

		expect(result).toEqual([]);
	});
});
