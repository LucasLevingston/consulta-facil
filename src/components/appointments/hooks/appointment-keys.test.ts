import { describe, expect, it } from "vitest";
import { appointmentKeys } from "./appointment-keys";

describe("appointmentKeys", () => {
	it("byPatient gera a query key correta", () => {
		expect(appointmentKeys.byPatient("p-1")).toEqual([
			"appointments",
			"patient",
			"p-1",
		]);
	});

	it("byProfessional gera a query key correta", () => {
		expect(appointmentKeys.byProfessional("d-1")).toEqual([
			"appointments",
			"professional",
			"d-1",
		]);
	});

	it("detail gera a query key correta", () => {
		expect(appointmentKeys.detail("a-1")).toEqual(["appointments", "a-1"]);
	});
});
