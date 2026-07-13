import { describe, expect, it } from "vitest";
import { getNavGroupsForRole } from "./get-nav-groups-for-role";
// Importar os módulos de registration executa os side-effects de registerNavItem
// uma única vez (cache de módulos ESM), populando o registry global compartilhado.
import "./registrations/default.nav";
import "./registrations/patient.nav";
import "./registrations/professional.nav";
import "./registrations/admin.nav";
import "./registrations/receptionist.nav";

describe("getNavGroupsForRole", () => {
	it("agrupa os itens do PATIENT em grupos por label, sem o campo roles", () => {
		const groups = getNavGroupsForRole("PATIENT");
		const labels = groups.map((g) => g.label).sort();
		expect(labels).toEqual(["Consultas", "Home"].sort());

		const totalItems = groups.reduce((acc, g) => acc + g.items.length, 0);
		expect(totalItems).toBe(9);

		for (const group of groups) {
			for (const item of group.items) {
				expect(item).not.toHaveProperty("roles");
				expect(item).not.toHaveProperty("label");
				expect(item.url.length).toBeGreaterThan(0);
			}
		}
	});

	it("agrupa os itens do ADMIN em 4 grupos (Home, Administração, Procedimentos, Conta)", () => {
		const groups = getNavGroupsForRole("ADMIN");
		const labels = groups.map((g) => g.label).sort();
		expect(labels).toEqual(
			["Administração", "Conta", "Home", "Procedimentos"].sort(),
		);

		const totalItems = groups.reduce((acc, g) => acc + g.items.length, 0);
		expect(totalItems).toBe(12);
	});

	it("agrupa os itens do PROFESSIONAL em 6 grupos", () => {
		const groups = getNavGroupsForRole("PROFESSIONAL");
		const labels = groups.map((g) => g.label).sort();
		expect(labels).toEqual(
			[
				"Home",
				"Consultas",
				"Pacientes",
				"Procedimentos",
				"Clínica",
				"Financeiro",
			].sort(),
		);
		const totalItems = groups.reduce((acc, g) => acc + g.items.length, 0);
		expect(totalItems).toBe(14);
	});

	it("agrupa os itens do RECEPTIONIST em 2 grupos (Home e Recepção)", () => {
		const groups = getNavGroupsForRole("RECEPTIONIST");
		const labels = groups.map((g) => g.label).sort();
		expect(labels).toEqual(["Home", "Recepção"].sort());
		const totalItems = groups.reduce((acc, g) => acc + g.items.length, 0);
		expect(totalItems).toBe(6);
	});
});
