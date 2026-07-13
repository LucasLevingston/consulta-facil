import { describe, expect, it } from "vitest";
import { formatDateTime } from "./format-date-time";

describe("formatDateTime", () => {
	const date = new Date(2024, 0, 15, 10, 30); // 15/01/2024 10:30

	it("dateOnly → dd/MM/yyyy", () => {
		expect(formatDateTime(date).dateOnly).toBe("15/01/2024");
	});

	it("timeOnly → HH:mm", () => {
		expect(formatDateTime(date).timeOnly).toBe("10:30");
	});

	it("dateTime contains date and time", () => {
		const { dateTime } = formatDateTime(date);
		expect(dateTime).toContain("15/01/2024");
		expect(dateTime).toContain("10:30");
	});

	it("dateTime contains 'às'", () => {
		expect(formatDateTime(date).dateTime).toContain("às");
	});

	it("formata meia-noite corretamente", () => {
		const midnight = new Date("2026-12-31T00:00:00");
		const result = formatDateTime(midnight);
		expect(result.timeOnly).toBe("00:00");
		expect(result.dateOnly).toBe("31/12/2026");
	});

	it("retorna objeto com três campos: dateTime, dateOnly, timeOnly", () => {
		const result = formatDateTime(new Date("2026-06-15T14:30:00"));
		expect(result).toHaveProperty("dateTime");
		expect(result).toHaveProperty("dateOnly");
		expect(result).toHaveProperty("timeOnly");
	});
});
