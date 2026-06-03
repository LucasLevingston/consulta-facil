import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	cn,
	convertFileToUrl,
	formatDateTime,
	getLabelByFormName,
	getPlaceholderByFormName,
} from "@/lib/utils";

// ── cn ────────────────────────────────────────────────────────────────────────

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

// ── getLabelByFormName ────────────────────────────────────────────────────────

describe("getLabelByFormName — mapeamento nome → label PT", () => {
	it("retorna label correto para campo email", () => {
		expect(getLabelByFormName("email")).toBe("E-mail");
	});

	it("retorna label correto para campo password", () => {
		expect(getLabelByFormName("password")).toBe("Senha");
	});

	it("retorna label correto para campo name", () => {
		expect(getLabelByFormName("name")).toBe("Nome");
	});

	it("retorna label correto para campo cpf", () => {
		expect(getLabelByFormName("cpf")).toBe("CPF");
	});

	it("retorna label correto para campo phone", () => {
		expect(getLabelByFormName("phone")).toBe("Telefone");
	});

	it("retorna label correto para campo birthDate", () => {
		expect(getLabelByFormName("birthDate")).toBe("Data de Nascimento");
	});

	it("retorna label correto para campo specialty", () => {
		expect(getLabelByFormName("specialty")).toBe("Especialidade");
	});

	it("retorna o próprio nome quando não mapeado (fallback)", () => {
		expect(getLabelByFormName("unknownField")).toBe("unknownField");
		expect(getLabelByFormName("customField123")).toBe("customField123");
	});

	it("é case-sensitive — 'Email' != 'email'", () => {
		expect(getLabelByFormName("Email")).toBe("Email");
		expect(getLabelByFormName("email")).toBe("E-mail");
	});
});

// ── getPlaceholderByFormName ──────────────────────────────────────────────────

describe("getPlaceholderByFormName — mapeamento nome → placeholder", () => {
	it("retorna placeholder correto para email", () => {
		expect(getPlaceholderByFormName("email")).toBe("seu@exemplo.com");
	});

	it("retorna placeholder correto para phone", () => {
		expect(getPlaceholderByFormName("phone")).toBe("(11) 99999-9999");
	});

	it("retorna placeholder correto para cpf", () => {
		expect(getPlaceholderByFormName("cpf")).toBe("000.000.000-00");
	});

	it("retorna placeholder correto para password", () => {
		expect(getPlaceholderByFormName("password")).toBe("••••••");
	});

	it("retorna string vazia para campos sem placeholder mapeado", () => {
		expect(getPlaceholderByFormName("specialty")).toBe("");
		expect(getPlaceholderByFormName("unknownField")).toBe("");
	});
});

// ── formatDateTime ────────────────────────────────────────────────────────────

describe("formatDateTime — formatação de data em pt-BR", () => {
	it("formata data e hora completa em pt-BR", () => {
		const date = new Date("2026-06-15T14:30:00");
		const result = formatDateTime(date);
		expect(result.dateTime).toMatch(/15\/06\/2026/);
		expect(result.dateTime).toMatch(/14:30/);
	});

	it("retorna dateOnly no formato dd/MM/yyyy", () => {
		const date = new Date("2026-01-05T08:00:00");
		const result = formatDateTime(date);
		expect(result.dateOnly).toBe("05/01/2026");
	});

	it("retorna timeOnly no formato HH:mm", () => {
		const date = new Date("2026-06-15T09:05:00");
		const result = formatDateTime(date);
		expect(result.timeOnly).toBe("09:05");
	});

	it("formata meia-noite corretamente", () => {
		const date = new Date("2026-12-31T00:00:00");
		const result = formatDateTime(date);
		expect(result.timeOnly).toBe("00:00");
		expect(result.dateOnly).toBe("31/12/2026");
	});

	it("retorna objeto com três campos: dateTime, dateOnly, timeOnly", () => {
		const result = formatDateTime(new Date("2026-06-15T14:30:00"));
		expect(result).toHaveProperty("dateTime");
		expect(result).toHaveProperty("dateOnly");
		expect(result).toHaveProperty("timeOnly");
	});
});

// ── convertFileToUrl ──────────────────────────────────────────────────────────

describe("convertFileToUrl — File → object URL", () => {
	beforeEach(() => {
		vi.stubGlobal("URL", {
			createObjectURL: vi.fn(() => "blob:http://localhost/abc-123"),
		});
	});

	it("chama URL.createObjectURL com o arquivo recebido", () => {
		const file = new File(["conteúdo"], "foto.jpg", { type: "image/jpeg" });

		convertFileToUrl(file);

		expect(URL.createObjectURL).toHaveBeenCalledWith(file);
	});

	it("retorna a URL gerada pelo browser", () => {
		const file = new File(["dados"], "exame.pdf", { type: "application/pdf" });

		const result = convertFileToUrl(file);

		expect(result).toBe("blob:http://localhost/abc-123");
	});

	it("arquivos diferentes produzem chamadas diferentes", () => {
		const f1 = new File(["a"], "a.png", { type: "image/png" });
		const f2 = new File(["b"], "b.png", { type: "image/png" });

		convertFileToUrl(f1);
		convertFileToUrl(f2);

		expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
		expect(URL.createObjectURL).toHaveBeenNthCalledWith(1, f1);
		expect(URL.createObjectURL).toHaveBeenNthCalledWith(2, f2);
	});
});
