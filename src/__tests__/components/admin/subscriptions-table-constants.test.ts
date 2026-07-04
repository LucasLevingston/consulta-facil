import { describe, expect, it } from "vitest";
import {
	OWNER_LABELS,
	STATUS_CONFIG,
} from "@/components/admin/subscriptions-table.constants";

describe("subscriptions-table.constants", () => {
	describe("STATUS_CONFIG", () => {
		it("define label e variant para o status ACTIVE", () => {
			expect(STATUS_CONFIG.ACTIVE).toEqual({
				label: "Ativa",
				variant: "default",
			});
		});

		it("define label e variant para o status PENDING", () => {
			expect(STATUS_CONFIG.PENDING).toEqual({
				label: "Pendente",
				variant: "secondary",
			});
		});

		it("define label e variant para o status CANCELLED", () => {
			expect(STATUS_CONFIG.CANCELLED).toEqual({
				label: "Cancelada",
				variant: "destructive",
			});
		});

		it("define label e variant para o status EXPIRED", () => {
			expect(STATUS_CONFIG.EXPIRED).toEqual({
				label: "Expirada",
				variant: "outline",
			});
		});

		it("não possui configuração para status desconhecidos", () => {
			expect(STATUS_CONFIG.UNKNOWN).toBeUndefined();
		});

		it("contém exatamente 4 status mapeados", () => {
			expect(Object.keys(STATUS_CONFIG)).toHaveLength(4);
		});
	});

	describe("OWNER_LABELS", () => {
		it("mapeia PROFESSIONAL para Médico", () => {
			expect(OWNER_LABELS.PROFESSIONAL).toBe("Médico");
		});

		it("mapeia CLINIC para Clínica", () => {
			expect(OWNER_LABELS.CLINIC).toBe("Clínica");
		});

		it("mapeia LABORATORY para Laboratório", () => {
			expect(OWNER_LABELS.LABORATORY).toBe("Laboratório");
		});

		it("contém exatamente 3 tipos de proprietário mapeados", () => {
			expect(Object.keys(OWNER_LABELS)).toHaveLength(3);
		});
	});
});
