"use client";

import { ClinicOverviewInfo } from "./ClinicOverviewInfo";
import { ClinicOverviewStats } from "./ClinicOverviewStats";
import type { ClinicOverviewTabProps } from "./ClinicOverviewTab.types";

export function ClinicOverviewTab({ clinic }: ClinicOverviewTabProps) {
	const memberCount = clinic.members?.length ?? 0;
	const specialties = [
		...new Set(clinic.members?.map((m) => m.specialty) ?? []),
	];

	return (
		<div className="space-y-4">
			<ClinicOverviewStats
				memberCount={memberCount}
				specialtyCount={specialties.length}
				ownerName={clinic.ownerName}
			/>
			<ClinicOverviewInfo clinic={clinic} specialties={specialties} />
		</div>
	);
}
