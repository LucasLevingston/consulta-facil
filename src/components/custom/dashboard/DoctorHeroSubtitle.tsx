"use client";

import { useMyProfessionalProfile } from "@/hooks/api/doctors/use-my-professional-profile";

export function DoctorHeroSubtitle() {
	const { data } = useMyProfessionalProfile(true);
	if (!data) return null;
	return (
		<p className="mt-1 text-sm text-muted-foreground">
			{data.specialty}
			{data.licenseNumber ? ` · CRM ${data.licenseNumber}` : ""}
		</p>
	);
}
