import { describe, expect, it } from "vitest";
import { PAYMENT_TYPE_LABELS } from "./payment-type-labels";

describe("PAYMENT_TYPE_LABELS", () => {
	it("CONSULTATION is 'Consulta'", () => {
		expect(PAYMENT_TYPE_LABELS.CONSULTATION).toBe("Consulta");
	});
	it("PROCEDURE is 'Procedimento'", () => {
		expect(PAYMENT_TYPE_LABELS.PROCEDURE).toBe("Procedimento");
	});
	it("EXAM is 'Exame'", () => {
		expect(PAYMENT_TYPE_LABELS.EXAM).toBe("Exame");
	});
	it("SUBSCRIPTION is 'Assinatura'", () => {
		expect(PAYMENT_TYPE_LABELS.SUBSCRIPTION).toBe("Assinatura");
	});
});
