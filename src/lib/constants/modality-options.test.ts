import { describe, expect, it } from "vitest";

describe("MODALITY_OPTIONS", () => {
	it("contém as opções IN_PERSON e ONLINE com label e desc não vazios", async () => {
		const { MODALITY_OPTIONS } = await import("./modality-options");
		expect(MODALITY_OPTIONS).toHaveLength(2);

		const values = MODALITY_OPTIONS.map((o) => o.value).sort();
		expect(values).toEqual(["IN_PERSON", "ONLINE"].sort());

		for (const option of MODALITY_OPTIONS) {
			expect(option.label.length).toBeGreaterThan(0);
			expect(option.desc.length).toBeGreaterThan(0);
		}
	});
});
