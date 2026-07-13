import { describe, expect, it, vi } from "vitest";
import { registry } from "./nav-registry-store";
// Importar os módulos de registration executa os side-effects de registerNavItem
// uma única vez (cache de módulos ESM), populando o registry global compartilhado.
import "./registrations/default.nav";
import "./registrations/patient.nav";
import "./registrations/professional.nav";
import "./registrations/admin.nav";
import "./registrations/receptionist.nav";

describe("nav-registry-store", () => {
	it("registry é um array mutável compartilhado entre os módulos de nav", () => {
		expect(Array.isArray(registry)).toBe(true);
		// já populado pelos imports de registrations acima
		expect(registry.length).toBeGreaterThan(0);
	});

	it("começa vazio em uma instância isolada de módulo (antes de qualquer registration)", async () => {
		vi.resetModules();
		const fresh = await import("./nav-registry-store");
		expect(fresh.registry).toEqual([]);
	});
});
