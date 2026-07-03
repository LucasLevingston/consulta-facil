"use client";

import { useMemo } from "react";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";
import type { ClinicsFilterOptions } from "./ClinicsFilterOptions.types";

export function useClinicFilterOptions(allClinics: ClinicResponse[]): ClinicsFilterOptions {
	return useMemo(
		() => ({
			availableStates: [...new Set(allClinics.flatMap((c) => (c.state ? [c.state] : [])))].sort(),
			availableSpecialties: [
				...new Set(allClinics.flatMap((c) => c.members?.map((m) => m.specialty) ?? [])),
			].sort(),
			availableProfessions: [
				...new Set(allClinics.flatMap((c) => c.members?.map((m) => m.role) ?? [])),
			].sort(),
			radiusOptions: RADIUS_OPTIONS,
		}),
		[allClinics],
	);
}
