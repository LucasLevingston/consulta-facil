import { describe, expect, it } from "vitest";
import { getNavItemsForRole } from "./get-nav-items-for-role";
// Importar os módulos de registration executa os side-effects de registerNavItem
// uma única vez (cache de módulos ESM), populando o registry global compartilhado.
import "./registrations/default.nav";
import "./registrations/patient.nav";
import "./registrations/professional.nav";
import "./registrations/admin.nav";
import "./registrations/receptionist.nav";

describe("registrations/default.nav.ts", () => {
	it("registra 3 itens visíveis para todas as roles, com paths e títulos não vazios", () => {
		for (const role of [
			"PATIENT",
			"PROFESSIONAL",
			"ADMIN",
			"RECEPTIONIST",
		] as const) {
			const items = getNavItemsForRole(role).filter((i) => i.label === "Home");
			expect(items).toHaveLength(3);
			for (const item of items) {
				expect(item.url).toMatch(/^\//);
				expect(item.title.length).toBeGreaterThan(0);
			}
		}
	});
});

describe("registrations por role", () => {
	it("PATIENT tem 9 itens (3 default + 6 específicos), todos com role correta e url não vazia", () => {
		const items = getNavItemsForRole("PATIENT");
		expect(items).toHaveLength(9);
		for (const item of items) {
			expect(item.roles).toContain("PATIENT");
			expect(item.url.length).toBeGreaterThan(0);
			expect(item.title.length).toBeGreaterThan(0);
		}
	});

	it("PROFESSIONAL tem 14 itens (3 default + 11 específicos)", () => {
		const items = getNavItemsForRole("PROFESSIONAL");
		expect(items).toHaveLength(14);
		for (const item of items) {
			expect(item.roles).toContain("PROFESSIONAL");
			expect(item.url.length).toBeGreaterThan(0);
		}
	});

	it("ADMIN tem 12 itens (3 default + 9 específicos)", () => {
		const items = getNavItemsForRole("ADMIN");
		expect(items).toHaveLength(12);
		for (const item of items) {
			expect(item.roles).toContain("ADMIN");
			expect(item.url.length).toBeGreaterThan(0);
		}
	});

	it("RECEPTIONIST tem 6 itens (3 default + 3 específicos)", () => {
		const items = getNavItemsForRole("RECEPTIONIST");
		expect(items).toHaveLength(6);
		for (const item of items) {
			expect(item.roles).toContain("RECEPTIONIST");
			expect(item.url.length).toBeGreaterThan(0);
		}
	});

	it("uma role inexistente no sistema de tipos não filtra nenhum item cadastrado", () => {
		// biome-ignore lint/suspicious/noExplicitAny: testando robustez do filtro
		const items = getNavItemsForRole("INEXISTENTE" as any);
		expect(items).toEqual([]);
	});
});
