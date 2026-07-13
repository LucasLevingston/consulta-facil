import { describe, expect, it } from "vitest";
import { STATUS_LABELS } from "./procedure-status-labels";

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
