import { describe, expect, it } from "vitest";
import {
	SUBSCRIPTION_STATUS_COLOR,
	SUBSCRIPTION_STATUS_LABEL,
} from "./subscription-status";

describe("SUBSCRIPTION_STATUS_COLOR", () => {
	it("ACTIVE includes green", () => {
		expect(SUBSCRIPTION_STATUS_COLOR.ACTIVE).toContain("green");
	});
	it("PENDING includes yellow", () => {
		expect(SUBSCRIPTION_STATUS_COLOR.PENDING).toContain("yellow");
	});
	it("CANCELLED includes red", () => {
		expect(SUBSCRIPTION_STATUS_COLOR.CANCELLED).toContain("red");
	});
	it("EXPIRED includes zinc", () => {
		expect(SUBSCRIPTION_STATUS_COLOR.EXPIRED).toContain("zinc");
	});
});

describe("SUBSCRIPTION_STATUS_LABEL", () => {
	it("ACTIVE is 'Ativo'", () => {
		expect(SUBSCRIPTION_STATUS_LABEL.ACTIVE).toBe("Ativo");
	});
	it("PENDING is 'Pendente'", () => {
		expect(SUBSCRIPTION_STATUS_LABEL.PENDING).toBe("Pendente");
	});
	it("CANCELLED is 'Cancelado'", () => {
		expect(SUBSCRIPTION_STATUS_LABEL.CANCELLED).toBe("Cancelado");
	});
	it("EXPIRED is 'Expirado'", () => {
		expect(SUBSCRIPTION_STATUS_LABEL.EXPIRED).toBe("Expirado");
	});
});
