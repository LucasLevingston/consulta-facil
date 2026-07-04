import { describe, expect, it } from "vitest";
import { adminNav } from "@/components/custom/sidebar/admin-nav";
import { defaultNav } from "@/components/custom/sidebar/default-nav";
import { patientNav } from "@/components/custom/sidebar/patient-nav";
import { receptionistNav } from "@/components/custom/sidebar/receptionist-nav";

// Estrutura comum: um array de grupos, cada grupo com label + items,
// cada item com title, url e icon (componente de ícone do lucide-react).
type NavItem = { title: string; url: string; icon: unknown; tooltip?: string };
type NavGroup = { label: string; items: NavItem[] };

function expectValidNavGroups(groups: NavGroup[]) {
	expect(Array.isArray(groups)).toBe(true);
	expect(groups.length).toBeGreaterThan(0);
	for (const group of groups) {
		expect(group.label.length).toBeGreaterThan(0);
		expect(Array.isArray(group.items)).toBe(true);
		expect(group.items.length).toBeGreaterThan(0);
		for (const item of group.items) {
			expect(item.title.length).toBeGreaterThan(0);
			expect(item.url).toMatch(/^\//);
			expect(item.icon).toBeDefined();
		}
	}
}

describe("adminNav", () => {
	it("possui 3 grupos com itens válidos (title, url, icon)", () => {
		expect(adminNav).toHaveLength(3);
		expectValidNavGroups(adminNav);
	});

	it("possui os labels de grupo esperados", () => {
		const labels = adminNav.map((g) => g.label);
		expect(labels).toEqual(["Administração", "Procedimentos", "Conta"]);
	});

	it("totaliza 9 itens de navegação (5 + 2 + 2)", () => {
		const total = adminNav.reduce((acc, g) => acc + g.items.length, 0);
		expect(total).toBe(9);
	});

	it("inclui o item Admin Dashboard apontando para /admin", () => {
		const items = adminNav.flatMap((g) => g.items);
		const adminDashboard = items.find((i) => i.title === "Admin Dashboard");
		expect(adminDashboard?.url).toBe("/admin");
	});
});

describe("defaultNav", () => {
	it("possui 1 grupo 'Home' com 3 itens válidos", () => {
		expect(defaultNav).toHaveLength(1);
		expect(defaultNav[0].label).toBe("Home");
		expect(defaultNav[0].items).toHaveLength(3);
		expectValidNavGroups(defaultNav);
	});

	it("todos os itens possuem tooltip descritivo", () => {
		for (const item of defaultNav[0].items) {
			expect(item.tooltip?.length).toBeGreaterThan(0);
		}
	});

	it("inclui o item Dashboard apontando para /dashboard", () => {
		const dashboard = defaultNav[0].items.find((i) => i.title === "Dashboard");
		expect(dashboard?.url).toBe("/dashboard");
	});
});

describe("patientNav", () => {
	it("possui 1 grupo 'Consultas' com 6 itens válidos", () => {
		expect(patientNav).toHaveLength(1);
		expect(patientNav[0].label).toBe("Consultas");
		expect(patientNav[0].items).toHaveLength(6);
		expectValidNavGroups(patientNav);
	});

	it("inclui o item Agendar Consulta apontando para /dashboard/appointments/create", () => {
		const item = patientNav[0].items.find(
			(i) => i.title === "Agendar Consulta",
		);
		expect(item?.url).toBe("/dashboard/appointments/create");
	});
});

describe("receptionistNav", () => {
	it("possui 1 grupo 'Recepção' com 3 itens válidos", () => {
		expect(receptionistNav).toHaveLength(1);
		expect(receptionistNav[0].label).toBe("Recepção");
		expect(receptionistNav[0].items).toHaveLength(3);
		expectValidNavGroups(receptionistNav);
	});

	it("inclui o Painel de Recepção apontando para /dashboard/reception", () => {
		const item = receptionistNav[0].items.find(
			(i) => i.title === "Painel de Recepção",
		);
		expect(item?.url).toBe("/dashboard/reception");
	});
});
