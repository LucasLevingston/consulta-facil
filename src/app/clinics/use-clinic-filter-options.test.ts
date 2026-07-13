import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import { useClinicFilterOptions } from "./use-clinic-filter-options";

describe("useClinicFilterOptions", () => {
	function makeClinic(overrides: Partial<ClinicResponse> = {}): ClinicResponse {
		return {
			id: "1",
			name: "Clínica Teste",
			status: "ACTIVE",
			ownerId: "owner-1",
			...overrides,
		};
	}

	it("retorna listas vazias e mantém radiusOptions quando não há clínicas", () => {
		const { result } = renderHook(() => useClinicFilterOptions([]));
		expect(result.current.availableStates).toEqual([]);
		expect(result.current.availableSpecialties).toEqual([]);
		expect(result.current.availableProfessions).toEqual([]);
		expect(result.current.radiusOptions).toBe(RADIUS_OPTIONS);
	});

	it("extrai estados, especialidades e profissões únicos e ordenados a partir das clínicas", () => {
		const clinics: ClinicResponse[] = [
			makeClinic({
				id: "1",
				state: "SP",
				members: [
					{
						professionalProfileId: "p1",
						specialty: "Cardiologia",
						role: "DOCTOR",
					},
				],
			}),
			makeClinic({
				id: "2",
				state: "RJ",
				members: [
					{
						professionalProfileId: "p2",
						specialty: "Cardiologia",
						role: "NURSE",
					},
				],
			}),
			makeClinic({ id: "3", state: "SP", members: [] }),
			makeClinic({ id: "4", state: null }),
		];

		const { result } = renderHook(() => useClinicFilterOptions(clinics));
		expect(result.current.availableStates).toEqual(["RJ", "SP"]);
		expect(result.current.availableSpecialties).toEqual(["Cardiologia"]);
		expect(result.current.availableProfessions).toEqual(["DOCTOR", "NURSE"]);
	});
});
