import { describe, expect, it } from "vitest";
import { getBmiLabel } from "@/features/patients/services/bmi.service";

describe("getBmiLabel", () => {
	it("below 18.5 → Abaixo do peso", () => {
		expect(getBmiLabel(17)).toBe("Abaixo do peso");
		expect(getBmiLabel(18.4)).toBe("Abaixo do peso");
	});

	it("18.5 to 24.9 → Normal", () => {
		expect(getBmiLabel(18.5)).toBe("Normal");
		expect(getBmiLabel(22)).toBe("Normal");
		expect(getBmiLabel(24.9)).toBe("Normal");
	});

	it("25 to 29.9 → Sobrepeso", () => {
		expect(getBmiLabel(25)).toBe("Sobrepeso");
		expect(getBmiLabel(27)).toBe("Sobrepeso");
		expect(getBmiLabel(29.9)).toBe("Sobrepeso");
	});

	it("30+ → Obesidade", () => {
		expect(getBmiLabel(30)).toBe("Obesidade");
		expect(getBmiLabel(40)).toBe("Obesidade");
	});
});
