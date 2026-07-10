import { describe, expect, it } from "vitest";
import { professionalKeys } from "./professional-keys";

describe("professionalKeys", () => {
	it("all retorna a chave raiz", () => {
		expect(professionalKeys.all).toEqual(["professionals"]);
	});

	it("list inclui page e size na chave", () => {
		expect(professionalKeys.list(0, 20)).toEqual([
			"professionals",
			"list",
			{ page: 0, size: 20 },
		]);
	});

	it("list sem argumentos inclui undefined", () => {
		expect(professionalKeys.list()).toEqual([
			"professionals",
			"list",
			{ page: undefined, size: undefined },
		]);
	});

	it("search inclui a especialidade na chave", () => {
		expect(professionalKeys.search("Cardiologia")).toEqual([
			"professionals",
			"search",
			"Cardiologia",
		]);
	});

	it("detail inclui o id na chave", () => {
		expect(professionalKeys.detail("d-42")).toEqual(["professionals", "d-42"]);
	});
});
