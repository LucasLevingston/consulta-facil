import { describe, expect, it } from "vitest";
import { BLOOD_TYPE_LABELS } from "@/utils/constants/blood-type-labels";
import { PAYMENT_TYPE_LABELS } from "@/utils/constants/payment-type-labels";
import { RELATIONSHIP_LABELS } from "@/utils/constants/relationship-labels";
import {
	SUBSCRIPTION_STATUS_COLOR,
	SUBSCRIPTION_STATUS_LABEL,
} from "@/utils/constants/subscription-status";

describe("BLOOD_TYPE_LABELS", () => {
	it("A_POSITIVE is 'A+'", () => {
		expect(BLOOD_TYPE_LABELS.A_POSITIVE).toBe("A+");
	});
	it("A_NEGATIVE is 'A-'", () => {
		expect(BLOOD_TYPE_LABELS.A_NEGATIVE).toBe("A-");
	});
	it("O_NEGATIVE is 'O-'", () => {
		expect(BLOOD_TYPE_LABELS.O_NEGATIVE).toBe("O-");
	});
	it("AB_POSITIVE is 'AB+'", () => {
		expect(BLOOD_TYPE_LABELS.AB_POSITIVE).toBe("AB+");
	});
	it("has 8 blood types", () => {
		expect(Object.keys(BLOOD_TYPE_LABELS)).toHaveLength(8);
	});
});

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

describe("RELATIONSHIP_LABELS", () => {
	it("CHILD is 'Filho(a)'", () => {
		expect(RELATIONSHIP_LABELS.CHILD).toBe("Filho(a)");
	});
	it("SPOUSE is 'Cônjuge'", () => {
		expect(RELATIONSHIP_LABELS.SPOUSE).toBe("Cônjuge");
	});
	it("OTHER is 'Outro'", () => {
		expect(RELATIONSHIP_LABELS.OTHER).toBe("Outro");
	});
	it("has PARENT and SIBLING keys", () => {
		expect(RELATIONSHIP_LABELS.PARENT).toBeDefined();
		expect(RELATIONSHIP_LABELS.SIBLING).toBeDefined();
	});
});

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
