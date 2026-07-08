"use client";

import { useClinicWorkingHours } from "@/features/schedule";
import { ClinicHoursEditor } from "./ClinicHoursEditor";
import type { ClinicWorkingHoursSectionProps } from "./ClinicWorkingHoursSection.types";

export function ClinicWorkingHoursContent({
	clinicId,
}: ClinicWorkingHoursSectionProps) {
	const { data: savedHours } = useClinicWorkingHours(clinicId);
	return <ClinicHoursEditor clinicId={clinicId} savedHours={savedHours} />;
}
