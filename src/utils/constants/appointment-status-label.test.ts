import { describe, expect, it } from "vitest";
import { STATUS_LABEL } from "./appointment-status-label";

describe("STATUS_LABEL (appointment)", () => {
	it("PENDING is 'Pendente'", () => {
		expect(STATUS_LABEL.PENDING).toBe("Pendente");
	});
	it("CONFIRMED is 'Confirmada'", () => {
		expect(STATUS_LABEL.CONFIRMED).toBe("Confirmada");
	});
	it("CANCELED is 'Cancelada'", () => {
		expect(STATUS_LABEL.CANCELED).toBe("Cancelada");
	});
	it("COMPLETED is 'Concluída'", () => {
		expect(STATUS_LABEL.COMPLETED).toBe("Concluída");
	});
	it("CHECKED_IN is 'Check-in feito'", () => {
		expect(STATUS_LABEL.CHECKED_IN).toBe("Check-in feito");
	});
});
