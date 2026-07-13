import { describe, expect, it } from "vitest";
import { STATUS_CONFIG } from "./appointment-status-config";

describe("STATUS_CONFIG (appointment)", () => {
	it("PENDING has secondary variant", () => {
		expect(STATUS_CONFIG.PENDING.variant).toBe("secondary");
	});
	it("CONFIRMED label is 'Confirmada'", () => {
		expect(STATUS_CONFIG.CONFIRMED.label).toBe("Confirmada");
	});
	it("CANCELED has destructive variant", () => {
		expect(STATUS_CONFIG.CANCELED.variant).toBe("destructive");
	});
	it("COMPLETED has outline variant", () => {
		expect(STATUS_CONFIG.COMPLETED.variant).toBe("outline");
	});
	it("has 6 statuses", () => {
		expect(Object.keys(STATUS_CONFIG)).toHaveLength(6);
	});
});
