import { describe, expect, it } from "vitest";

import { formatDateTime } from "@/lib/utils/format-date-time";
import { getPlaceholderByFormName } from "@/lib/utils/get-placeholder-by-form-name";

// ── getPlaceholderByFormName ──────────────────────────────────────────────────

describe("getPlaceholderByFormName — mapeamento nome → placeholder", () => {
	it("retorna placeholder correto para email", () => {
		expect(getPlaceholderByFormName("email")).toBe("seu@exemplo.com");
	});

	it("retorna placeholder correto para phone", () => {
		expect(getPlaceholderByFormName("phone")).toBe("(11) 99999-9999");
	});

	it("retorna placeholder correto para cpf", () => {
		expect(getPlaceholderByFormName("cpf")).toBe("000.000.000-00");
	});

	it("retorna placeholder correto para password", () => {
		expect(getPlaceholderByFormName("password")).toBe("••••••");
	});

	it("retorna string vazia para campos sem placeholder mapeado", () => {
		expect(getPlaceholderByFormName("specialty")).toBe("");
		expect(getPlaceholderByFormName("unknownField")).toBe("");
	});
});

// ── formatDateTime ────────────────────────────────────────────────────────────

describe("formatDateTime — formatação de data em pt-BR", () => {
	it("formata data e hora completa em pt-BR", () => {
		const date = new Date("2026-06-15T14:30:00");
		const result = formatDateTime(date);
		expect(result.dateTime).toMatch(/15\/06\/2026/);
		expect(result.dateTime).toMatch(/14:30/);
	});

	it("retorna dateOnly no formato dd/MM/yyyy", () => {
		const date = new Date("2026-01-05T08:00:00");
		const result = formatDateTime(date);
		expect(result.dateOnly).toBe("05/01/2026");
	});

	it("retorna timeOnly no formato HH:mm", () => {
		const date = new Date("2026-06-15T09:05:00");
		const result = formatDateTime(date);
		expect(result.timeOnly).toBe("09:05");
	});

	it("formata meia-noite corretamente", () => {
		const date = new Date("2026-12-31T00:00:00");
		const result = formatDateTime(date);
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
