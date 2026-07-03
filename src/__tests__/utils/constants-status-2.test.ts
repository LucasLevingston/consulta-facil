import { describe, expect, it } from "vitest";
import { STATUS_LABELS } from "@/utils/constants/procedure-status-labels";
import { STATUS_VARIANTS } from "@/utils/constants/procedure-status-variants";

describe("STATUS_VARIANTS (procedure)", () => {
	it("PENDING is 'default'", () => {
		expect(STATUS_VARIANTS.PENDING).toBe("default");
	});
	it("CANCELED is 'destructive'", () => {
		expect(STATUS_VARIANTS.CANCELED).toBe("destructive");
	});
	it("COMPLETED is 'outline'", () => {
		expect(STATUS_VARIANTS.COMPLETED).toBe("outline");
	});
	it("SCHEDULED is 'secondary'", () => {
		expect(STATUS_VARIANTS.SCHEDULED).toBe("secondary");
	});
});

describe("STATUS_LABELS (procedure)", () => {
	it("PENDING is 'Pendente'", () => {
		expect(STATUS_LABELS.PENDING).toBe("Pendente");
	});
	it("SCHEDULED is 'Agendado'", () => {
		expect(STATUS_LABELS.SCHEDULED).toBe("Agendado");
	});
	it("COMPLETED is 'Concluído'", () => {
		expect(STATUS_LABELS.COMPLETED).toBe("Concluído");
	});
	it("CANCELED is 'Cancelado'", () => {
		expect(STATUS_LABELS.CANCELED).toBe("Cancelado");
	});
});
