import { describe, expect, it } from "vitest";
import { formatDateTime } from "@/lib/utils/format-date-time";

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
});
