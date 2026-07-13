import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn — merge de classes Tailwind", () => {
	it("combina strings simples", () => {
		expect(cn("px-4", "py-2")).toBe("px-4 py-2");
	});

	it("filtra valores falsy", () => {
		expect(cn("px-4", false, undefined, null, "py-2")).toBe("px-4 py-2");
	});

	it("resolve conflito de classes Tailwind (última vence)", () => {
		expect(cn("p-4", "p-8")).toBe("p-8");
		expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
	});

	it("aceita array de classes", () => {
		expect(cn(["px-4", "py-2"])).toBe("px-4 py-2");
	});

	it("aceita objeto condicional", () => {
		expect(cn({ "px-4": true, "py-2": false })).toBe("px-4");
	});

	it("retorna string vazia quando sem classes", () => {
		expect(cn()).toBe("");
		expect(cn(false, undefined)).toBe("");
	});

	it("combina objeto + string + array", () => {
		const result = cn("base", { active: true, disabled: false }, ["extra"]);
		expect(result).toContain("base");
		expect(result).toContain("active");
		expect(result).toContain("extra");
		expect(result).not.toContain("disabled");
	});
});
