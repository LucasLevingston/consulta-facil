import { beforeEach, describe, expect, it, vi } from "vitest";

import { convertFileToUrl } from "@/lib/utils/convert-file-to-url";

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
