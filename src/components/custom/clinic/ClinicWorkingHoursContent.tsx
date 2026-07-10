"use client";

import { ClinicHoursEditor } from "./ClinicHoursEditor";
import type { ClinicWorkingHoursSectionProps } from "./ClinicWorkingHoursSection.types";
import { useClinicWorkingHours } from "./use-clinic-working-hours";

export function ClinicWorkingHoursContent({
	clinicId,
}: ClinicWorkingHoursSectionProps) {
	const { data: savedHours } = useClinicWorkingHours(clinicId);
	return <ClinicHoursEditor clinicId={clinicId} savedHours={savedHours} />;
}
