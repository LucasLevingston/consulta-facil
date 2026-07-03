import { describe, expect, it } from "vitest";
import { getBmiLabel } from "@/utils/bmi";
import { formatBRL } from "@/utils/format-brl";
import { formatCurrency } from "@/utils/format-currency";
import { formatPercent } from "@/utils/format-percent";

describe("formatBRL", () => {
	it("formats 100", () => {
		expect(formatBRL(100)).toMatch(/R\$\s*100,00/);
	});
	it("formats 0", () => {
		expect(formatBRL(0)).toMatch(/R\$\s*0,00/);
	});
	it("formats 9.99", () => {
		expect(formatBRL(9.99)).toMatch(/9,99/);
	});
	it("returns string", () => {
		expect(typeof formatBRL(50)).toBe("string");
	});
});

describe("formatCurrency", () => {
	it("formats 100", () => {
		expect(formatCurrency(100)).toMatch(/R\$\s*100,00/);
	});
	it("formats 0", () => {
		expect(formatCurrency(0)).toMatch(/R\$\s*0,00/);
	});
	it("formats 9.99", () => {
		expect(formatCurrency(9.99)).toMatch(/9,99/);
	});
	it("returns string", () => {
		expect(typeof formatCurrency(50)).toBe("string");
	});
});

describe("formatPercent", () => {
	it("0.1 → '10.00%'", () => {
		expect(formatPercent(0.1)).toBe("10.00%");
	});
	it("0 → '0.00%'", () => {
		expect(formatPercent(0)).toBe("0.00%");
	});
	it("1 → '100.00%'", () => {
		expect(formatPercent(1)).toBe("100.00%");
	});
	it("0.5 → '50.00%'", () => {
		expect(formatPercent(0.5)).toBe("50.00%");
	});
	it("always appends %", () => {
		expect(formatPercent(0.25)).toMatch(/%$/);
	});
});

describe("getBmiLabel", () => {
	it("17 → 'Abaixo do peso'", () => {
		expect(getBmiLabel(17)).toBe("Abaixo do peso");
	});
	it("22 → 'Normal'", () => {
		expect(getBmiLabel(22)).toBe("Normal");
	});
	it("27 → 'Sobrepeso'", () => {
		expect(getBmiLabel(27)).toBe("Sobrepeso");
	});
	it("35 → 'Obesidade'", () => {
		expect(getBmiLabel(35)).toBe("Obesidade");
	});
});
