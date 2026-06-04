"use client";

import { useMyClinic } from "@/hooks/api/clinics/use-my-clinic";
import { QueryBoundary } from "@/providers/query-boundary";
import { ClinicForm } from "../../forms/ClinicForm";
import { ClinicWorkingHoursSection } from "./ClinicWorkingHoursSection";
import { ReceptionistsSection } from "./ReceptionistsSection";

export function MyClinicContent() {
	const { data: clinics = [], isLoading, error } = useMyClinic();
	const existing = clinics[0];

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<div className="space-y-10">
				<ClinicForm clinic={existing} />
				{existing && <ClinicWorkingHoursSection clinicId={existing.id} />}
				{existing && <ReceptionistsSection clinicId={existing.id} />}
			</div>
		</QueryBoundary>
	);
}
