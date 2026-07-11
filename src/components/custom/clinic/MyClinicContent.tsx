"use client";

import { useMyClinic } from "@/components/clinic/hooks";
import { ClinicForm } from "../../forms/ClinicForm";
import { ClinicWorkingHoursSection } from "./ClinicWorkingHoursSection";
import { ReceptionistsSection } from "./ReceptionistsSection";

export function MyClinicContent() {
	const { data: clinics } = useMyClinic();
	const existing = clinics[0];

	return (
		<div className="space-y-10">
			<ClinicForm clinic={existing} />
			{existing && <ClinicWorkingHoursSection clinicId={existing.id} />}
			{existing && <ReceptionistsSection clinicId={existing.id} />}
		</div>
	);
}
