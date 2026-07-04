import { describe, expect, it } from "vitest";

import { buildDefaultRow } from "@/components/schedule/ScheduleEditor.utils";
import { DEFAULT_BREAK } from "@/utils/constants/default-break";
import { DEFAULT_DURATION } from "@/utils/constants/default-duration";

describe("buildDefaultRow", () => {
	it("retorna os valores salvos quando existe um horário salvo para o dia", () => {
		const saved = {
			dayOfWeek: "MONDAY" as const,
			startTime: "09:00",
			endTime: "17:00",
			consultationDurationMinutes: 45,
			breakBetweenConsultationsMinutes: 10,
			isActive: true,
		};
		const row = buildDefaultRow("MONDAY", saved);
		expect(row).toEqual(saved);
	});

	it("retorna valores padrão de dia útil quando não há horário salvo", () => {
		const row = buildDefaultRow("TUESDAY");
		expect(row).toEqual({
			dayOfWeek: "TUESDAY",
			startTime: "08:00",
			endTime: "18:00",
			consultationDurationMinutes: DEFAULT_DURATION,
			breakBetweenConsultationsMinutes: DEFAULT_BREAK,
			isActive: true,
		});
	});

	it("marca sábado como inativo por padrão quando não há horário salvo", () => {
		const row = buildDefaultRow("SATURDAY");
		expect(row.isActive).toBe(false);
	});

	it("marca domingo como inativo por padrão quando não há horário salvo", () => {
		const row = buildDefaultRow("SUNDAY");
		expect(row.isActive).toBe(false);
	});

	it("usa isActive do horário salvo mesmo em fim de semana", () => {
		const saved = {
			dayOfWeek: "SUNDAY" as const,
			startTime: "10:00",
			endTime: "12:00",
			consultationDurationMinutes: 30,
			breakBetweenConsultationsMinutes: 5,
			isActive: true,
		};
		const row = buildDefaultRow("SUNDAY", saved);
		expect(row.isActive).toBe(true);
	});
});
