"use client";

import { useMyProfessionalProfile } from "@/features/professionals";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

export function ProfessionalHeroSubtitle() {
	const { data } = useMyProfessionalProfile(true);
	if (!data) return null;
	return (
		<p className="mt-1 text-sm text-muted-foreground">
			{SPECIALTY_LABELS[data.specialty] ?? data.specialty}
			{data.licenseNumber ? ` · CRM ${data.licenseNumber}` : ""}
		</p>
	);
}
