import { Home } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { registry } from "./nav-registry-store";
import { registerNavItem } from "./register-nav-item";
// Importar os módulos de registration executa os side-effects de registerNavItem
// uma única vez (cache de módulos ESM), populando o registry global compartilhado.
import "./registrations/default.nav";
import "./registrations/patient.nav";
import "./registrations/professional.nav";
import "./registrations/admin.nav";
import "./registrations/receptionist.nav";

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
			"./register-nav-item"
		);
		const { getNavItemsForRole: freshGetNavItemsForRole } = await import(
			"./get-nav-items-for-role"
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
