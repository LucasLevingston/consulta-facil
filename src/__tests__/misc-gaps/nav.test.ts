import { Home } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { getNavGroupsForRole } from "@/lib/nav/get-nav-groups-for-role";
import { getNavItemsForRole } from "@/lib/nav/get-nav-items-for-role";
import { registry } from "@/lib/nav/nav-registry-store";
import { registerNavItem } from "@/lib/nav/register-nav-item";
// Importar os módulos de registration executa os side-effects de registerNavItem
// uma única vez (cache de módulos ESM), populando o registry global compartilhado.
import "@/lib/nav/registrations/default.nav";
import "@/lib/nav/registrations/patient.nav";
import "@/lib/nav/registrations/professional.nav";
import "@/lib/nav/registrations/admin.nav";
import "@/lib/nav/registrations/receptionist.nav";

describe("nav-registry-store", () => {
	it("registry é um array mutável compartilhado entre os módulos de nav", () => {
		expect(Array.isArray(registry)).toBe(true);
		// já populado pelos imports de registrations acima
		expect(registry.length).toBeGreaterThan(0);
	});

	it("começa vazio em uma instância isolada de módulo (antes de qualquer registration)", async () => {
		vi.resetModules();
		const fresh = await import("@/lib/nav/nav-registry-store");
		expect(fresh.registry).toEqual([]);
	});
});

describe("registerNavItem", () => {
	it("adiciona uma entrada ao registry compartilhado", () => {
		const before = registry.length;
		registerNavItem({
			roles: ["PATIENT"],
			label: "Grupo Teste",
			title: "Item Teste",
			url: "/teste-item",
			icon: Home,
		});
		expect(registry.length).toBe(before + 1);
		expect(registry[registry.length - 1]).toMatchObject({
			label: "Grupo Teste",
			title: "Item Teste",
			url: "/teste-item",
		});
		// limpa o item adicionado para não afetar outros testes que dependem
		// das contagens reais produzidas pelos módulos de registrations
		registry.pop();
	});

	it("em uma instância isolada, registra corretamente e é visível para getNavItemsForRole", async () => {
		vi.resetModules();
		const { registerNavItem: freshRegister } = await import(
			"@/lib/nav/register-nav-item"
		);
		const { getNavItemsForRole: freshGetNavItemsForRole } = await import(
			"@/lib/nav/get-nav-items-for-role"
		);
		freshRegister({
			roles: ["ADMIN"],
			label: "Isolado",
			title: "Item Isolado",
			url: "/isolado",
			icon: Home,
		});
		const items = freshGetNavItemsForRole("ADMIN");
		expect(items).toHaveLength(1);
		expect(items[0].url).toBe("/isolado");
	});
});

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
